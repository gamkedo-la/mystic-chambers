
//Requires Vector2

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

function drawSectorsMap(renderer, typeColors, plPos, off, sec)
{
    var sector = undefined;
    if(typeof sec != "undefined") sector = sec;
    else if(typeof activeSector != "undefined") sector = activeSector

    sector.addOffset(off);

    if(typeof sector != "undefined")
    {
        var Ax = sector.p1.x; var Ay = sector.p1.y;
        var Bx = sector.p2.x; var By = sector.p2.y;
        var X = plPos.x; var Y = plPos.y;
        Bx -= Ax; By -= Ay; X -= Ax; Y -= Ay;
        var pos = (Bx * Y) - (By * X);

        /*
        //active sector is selected in the raycast sector function; no need here
        if(((pos < 0 && sector.sectorData.direction > 0)
            || (pos > 0 && sector.sectorData.direction < 0))
        && sector.sectorData.direction != 0)
        {
            activeSector = sector;
        }*/

        if(pos < 0)
        {
            sector.sectorData.direction = -1;
            if(typeof sector.sectorData.wallsLeft != "undefined")
            {
                for(let i = 0; i < sector.sectorData.wallsLeft.length; i++)
                {
                    sector.sectorData.wallsLeft[i].addOffset(off);
                    sector.sectorData.wallsLeft[i].draw(renderer, typeColors, plPos);
                    sector.sectorData.wallsLeft[i].addOffset(vec2(-off.x, -off.y));
                }
            }
            if(activeSector == sector
                && typeof sector.sectorData.sectorsLeft != "undefined")
            {
                for(let i = 0; i < sector.sectorData.sectorsLeft.length; i++)
                    drawSectorsMap(renderer, typeColors, plPos, off, sector.sectorData.sectorsLeft[i]);
            }
        }
        else
        {
            activeSector.sectorData.direction = 1;
            if(typeof activeSector.sectorData.wallsRight != "undefined")
            {
                for(let i = 0; i < sector.sectorData.wallsRight.length; i++)
                {
                    sector.sectorData.wallsRight[i].addOffset(off);
                    sector.sectorData.wallsRight[i].draw(renderer, typeColors, plPos);
                    sector.sectorData.wallsRight[i].addOffset(vec2(-off.x, -off.y));
                }
            }
            if(activeSector == sector
                && typeof sector.sectorData.sectorsRight != "undefined")
            {
                for(let i = 0; i < sector.sectorData.sectorsRight.length; i++)
                    drawSectorsMap(renderer, typeColors, plPos, off, sector.sectorData.sectorsRight[i]);
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