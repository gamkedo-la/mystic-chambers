
wallImages = [
    new ImageObject("images/door.png", vec2(160, 160)),
    new ImageObject("images/wall_stone_moss.png", vec2(160, 160)),
    new ImageObject("images/wall_stone.png", vec2(160, 160)),
];
wallColors = [
    "#ffff0099",
    "#50505099",
    "#ff000099"
];
wall = [];

var wallCollisionMinDistance = 250.0;

activeSector = undefined;
class SectorData {
    constructor()
    {
        this.wallsLeft = undefined;
        this.entitiesLeft = undefined;
        this.sectorsLeft = undefined;

        this.wallsRight = undefined;
        this.entitiesRight = undefined;
        this.sectorsRight = undefined;

        this.direction = 0;
    }
}

totalWalls = 0;
class Wall
{
    constructor()
    {
        this.p1 = vec2(0.0, 0.0);
        this.p2 = vec2(0.0, 0.0);
        this.angle = 0.0;
        this.type = 0;
        this.decal = undefined;

        this.sectorData = new SectorData();

        this.index = totalWalls++;
    }

    set(x1, y1, x2, y2)
    {
        this.p1.x = x1;
        this.p1.y = y1;
        this.p2.x = x2;
        this.p2.y = y2;
        this.angle = this.p1.angle(this.p2);
    }

    draw(renderer, typeColors, length)
    {
        drawLine(renderer, this.p1, this.p2,
            typeof typeColors == "undefined" ? "white" : typeColors[this.type]);

        if(typeof length != "undefined")
		{
			var dist = getDistBtwVec2(this.p1, this.p2);
			
			var a = this.angle;
			
			var midVec2 = vec2(
                this.p1.x - ((dist/2.0) * Math.cos(a)),
                this.p1.y - ((dist/2.0) * Math.sin(a))
            );
		    
		    drawLine(renderer, midVec2,
		    vec2(midVec2.x - (length * Math.cos(a + degToRad(90.0))),
            (midVec2.y - (length * Math.sin(a + degToRad(90.0))))),
            "#333333");
		}
    }

    addOffset(vec2)
    {
        this.p1.x += vec2.x;
        this.p1.y += vec2.y;
        this.p2.x += vec2.x;
        this.p2.y += vec2.y;
    }

    getCollValue(p, prevP, allowSectors, readOnlyMode)
    {
        if(typeof allowSectors == "undefined" || allowSectors == false)
        {
            if(this.type <= 0) return p;
            if(typeof this.sectorData.wallsLeft != "undefined"
            || typeof this.sectorData.wallsRight != "undefined") return p;
        }
        
        var a = this.angle;

        var Ax = this.p1.x;// - (wallCollisionPadding * this.direction * Math.cos(a + degToRad(90.0)));
        var Ay = this.p1.y;// - (wallCollisionPadding * this.direction * Math.sin(a + degToRad(90.0)));
        var Bx = this.p2.x;// - (wallCollisionPadding * this.direction * Math.cos(a + degToRad(90.0)));
        var By = this.p2.y;// - (wallCollisionPadding * this.direction * Math.sin(a + degToRad(90.0)));
        var X = p.x; var Y = p.y;
        Bx -= Ax; By -= Ay; X -= Ax; Y -= Ay;
        var prevPosPadd = (Bx * Y) - (By * X);

        Ax = this.p1.x;// - (wallCollisionPadding * this.direction * Math.cos(a + degToRad(90.0)));
        Ay = this.p1.y;// - (wallCollisionPadding * this.direction * Math.sin(a + degToRad(90.0)));
        Bx = this.p2.x;// - (wallCollisionPadding * this.direction * Math.cos(a + degToRad(90.0)));
        By = this.p2.y;// - (wallCollisionPadding * this.direction * Math.sin(a + degToRad(90.0)));
        X = prevP.x; Y = prevP.y;
        Bx -= Ax; By -= Ay; X -= Ax; Y -= Ay;
        var posPadd = (Bx * Y) - (By * X);

        if((posPadd < -wallCollisionMinDistance
        && !(prevPosPadd < -wallCollisionMinDistance))
        || (posPadd > wallCollisionMinDistance
        && !(prevPosPadd > wallCollisionMinDistance)))
            p = prevP;
        
        return p;
    }

    flipPoints()
    {
        var sx = this.p1.x;
        var sy = this.p1.y;
        this.p1.x = this.p2.x;
        this.p1.y = this.p2.y;
        this.p2.x = sx;
        this.p2.y = sy;
        this.angle = this.p1.angle(this.p2);
    }

    toString()
    {
        if(isNaN(Math.floor(this.p1.x * 100.0)) || isNaN(Math.floor(this.p1.y * 100.0))) return "";
        return Math.floor(this.p1.x * 100.0).toString() + " " + Math.floor(this.p1.y * 100.0).toString() + " " +
            Math.floor(this.p2.x * 100.0).toString() + " " + Math.floor(this.p2.y * 100.0).toString() + " " +
            Math.floor(this.type).toString() + " ";
    }
}

class WallData
{
    constructor()
    {
        this.index = -1;
        this.depth = -1.0;
        this.lengthPoint = -1.0;
        this.length = -1.0;
        this.angle = -1.0;
        this.type = -1;
        this.decal = undefined;
    }
};

function convertWallsToString(walls)
{
    var str = "";
    for(let i = 0; i < walls.length; i++) str += walls[i].toString();
    str += ".";
    return str;
}

function generateWallsFromString(walls, str)
{
    var values = str.split(' ');
    for(let i = 0; i < values.length; i+=5)
    {
        var newWall = new Wall();
        newWall.set(parseInt(values[i] / 100.0), parseInt(values[i+1] / 100.0), parseInt(values[i+2] / 100.0), parseInt(values[i+3] / 100.0));
        newWall.type = parseInt(values[i+4]);
        walls.push(newWall);
    }
}

function calculateActiveSector(plPos, sec)
{
    var sector = undefined;
    if(typeof sec != "undefined") sector = sec;
    else if(typeof activeSector != "undefined") sector = activeSector;

    if(typeof sector != "undefined")
    {
        var Ax = sector.p1.x; var Ay = sector.p1.y;
        var Bx = sector.p2.x; var By = sector.p2.y;
        var X = plPos.x; var Y = plPos.y;
        Bx -= Ax; By -= Ay; X -= Ax; Y -= Ay;
        var pos = (Bx * Y) - (By * X);

        if(((pos < 0 && sector.sectorData.direction > 0)
            || (pos > 0 && sector.sectorData.direction < 0))
        && sector.sectorData.direction != 0)
        {
            activeSector = sector;
        }

        if(pos < 0)
        {
            sector.sectorData.direction = -1;
            if(activeSector == sector
                && typeof sector.sectorData.sectorsLeft != "undefined")
            {
                for(let i = 0; i < sector.sectorData.sectorsLeft.length; i++)
                    calculateActiveSector(plPos, sector.sectorData.sectorsLeft[i]);
            }
        }
        else
        {
            sector.sectorData.direction = 1;
            if(activeSector == sector
                && typeof sector.sectorData.sectorsRight != "undefined")
            {
                for(let i = 0; i < sector.sectorData.sectorsRight.length; i++)
                    calculateActiveSector(plPos, sector.sectorData.sectorsRight[i]);
            }
        }
    }
}

function detectActiveSector(sector, plPos)
{
    var Ax = sector.p1.x; var Ay = sector.p1.y;
    var Bx = sector.p2.x; var By = sector.p2.y;
    var X = plPos.x; var Y = plPos.y;
    Bx -= Ax; By -= Ay; X -= Ax; Y -= Ay;
    var pos = (Bx * Y) - (By * X);

    if(((pos < 0 && sector.sectorData.direction > 0)
        || (pos > 0 && sector.sectorData.direction < 0))
    && sector.sectorData.direction != 0)
    {
        activeSector = sector;
    }

    return pos;
}

function drawSectorMapWallsLeft(sector, off)
{
    if(typeof sector.sectorData.wallsLeft != "undefined")
    {
        for(let i = 0; i < sector.sectorData.wallsLeft.length; i++)
        {
            if(sector.sectorData.wallsLeft[i].type == 0)
            {
            sector.sectorData.wallsLeft[i].addOffset(off);
            sector.sectorData.wallsLeft[i].draw(renderer, undefined, plPos);
            sector.sectorData.wallsLeft[i].addOffset(vec2(-off.x, -off.y));
            }
        }
    }
}

function drawSectorMapWallsRight(sector, off)
{
    if(typeof sector.sectorData.wallsRight != "undefined")
    {
        for(let i = 0; i < sector.sectorData.wallsRight.length; i++)
        {
            if(sector.sectorData.wallsRight[i].type == 0)
            {
            sector.sectorData.wallsRight[i].addOffset(off);
            sector.sectorData.wallsRight[i].draw(renderer, undefined, plPos);
            sector.sectorData.wallsRight[i].addOffset(vec2(-off.x, -off.y));
            }
        }
    }
}

function drawSectorsMap(renderer, plPos, off, sec)
{
    var sector = undefined;
    if(typeof sec != "undefined") sector = sec;
    else if(typeof activeSector != "undefined") sector = activeSector;

    sector.addOffset(off);
    if(typeof sector != "undefined")
    {
        pos = detectActiveSector(sector, plPos);
        if(pos < 0)
        {
            sector.sectorData.direction = -1;
            drawSectorMapWallsLeft(sector, off);
            if(activeSector == sector
                && typeof sector.sectorData.sectorsLeft != "undefined")
            {
                for(let i = 0; i < sector.sectorData.sectorsLeft.length; i++)
                    drawSectorsMap(renderer, plPos, off, sector.sectorData.sectorsLeft[i]);
            }
        }
        else
        {
            sector.sectorData.direction = 1;
            drawSectorMapWallsRight(sector, off);
            if(activeSector == sector
                && typeof sector.sectorData.sectorsRight != "undefined")
            {
                for(let i = 0; i < sector.sectorData.sectorsRight.length; i++)
                    drawSectorsMap(renderer, plPos, off, sector.sectorData.sectorsRight[i]);
            }
        }
    }
    sector.addOffset(vec2(-off.x, -off.y));
}

function resetWallIndexes()
{
    //sectors are type 0 walls
    //sectors must checked with rays BEFORE all the other walls
    wall.sort(
        function(wA, wB) {
            return wA.type < wB.type ? 1 : -1;
        }
    );

    for(let i = 0; i < wall.length; i++)
    {
        wall[i].index = i;
    }
}

function collisionWithWallsInSector(currentPos, previousPos, sec, readOnlyMode)
{
    if(currentPos == previousPos) return currentPos;

    if(typeof sec == "undefined") sec = activeSector;

    if(typeof sec != "undefined")
    {
        var Ax = sec.p1.x; var Ay = sec.p1.y;
        var Bx = sec.p2.x; var By = sec.p2.y;
        var X = currentPos.x; var Y = currentPos.y;
        Bx -= Ax; By -= Ay; X -= Ax; Y -= Ay;
        var pos = (Bx * Y) - (By * X);

        if(pos < 0 && typeof sec.sectorData.wallsLeft != "undefined")
        {
            for(let i = 0; i < sec.sectorData.wallsLeft.length; i++)
            {
                if(typeof sec.sectorData.wallsLeft[i].sectorData.wallsLeft == "undefined"
                && typeof sec.sectorData.wallsLeft[i].sectorData.wallsRight == "undefined"
                && sec.sectorData.wallsLeft[i].type > 0)
                {
                    currentPos = sec.sectorData.wallsLeft[i].getCollValue(currentPos, previousPos, readOnlyMode);
                    if(currentPos == previousPos) return currentPos;
                }
            }
        }
        if(pos > 0 && typeof sec.sectorData.wallsRight != "undefined")
        {
            for(let i = 0; i < sec.sectorData.wallsRight.length; i++)
            {
                if(typeof sec.sectorData.wallsRight[i].sectorData.wallsLeft == "undefined"
                && typeof sec.sectorData.wallsRight[i].sectorData.wallsRight == "undefined"
                && sec.sectorData.wallsRight[i].type > 0)
                {
                    currentPos = sec.sectorData.wallsRight[i].getCollValue(currentPos, previousPos, readOnlyMode);
                    if(currentPos == previousPos) return currentPos;
                }
            }
        }
    }

    return currentPos;
}

//For moving entities; to keep them inside the sectors
function collisionWithSectorsInSector(currentPos, previousPos, sec)
{
    if(currentPos == previousPos) return currentPos;

    currentPos = sec.getCollValue(currentPos, previousPos);
    if(currentPos == previousPos) return currentPos;

    if(typeof sec.sectorData.sectorsLeft != "undefined")
    {
        for(let i = 0; i < sec.sectorData.sectorsLeft.length; i++)
        {
            currentPos = sec.sectorData.sectorsLeft[i].getCollValue(currentPos, previousPos, true);
            if(currentPos == previousPos) return currentPos;
        }
    }
    else if(typeof sec.sectorData.sectorsRight != "undefined")
    {
        for(let i = 0; i < sec.sectorData.sectorsRight.length; i++)
        {
            currentPos = sec.sectorData.sectorsRight[i].getCollValue(currentPos, previousPos, true);
            if(currentPos == previousPos) return currentPos;
        }
    }

    return currentPos;
}