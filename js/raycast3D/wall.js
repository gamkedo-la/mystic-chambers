
wallImages = [
    new ImageObject("images/sector.png", vec2(160, 160)),
    new ImageObject("images/wallBrickGreen.png", vec2(160, 160)),
    new ImageObject("images/wallBrickPurple.png", vec2(160, 160)),
    new ImageObject("images/wallBrickRed.png", vec2(160, 160)),
    new ImageObject("images/wallBrickRedCracked.png", vec2(160, 160)),
    new ImageObject("images/wallDanger.png", vec2(160, 160)),
    // new walls with decorated variants
    new ImageObject("images/wallCarbon.png", vec2(160, 160)),
    new ImageObject("images/wallCarbonReinforced.png", vec2(160, 160)),
    new ImageObject("images/wallMarble.png", vec2(160, 160)),
    new ImageObject("images/wallMarbleGoldtrim.png", vec2(160, 160)),
    new ImageObject("images/wallObsidian.png", vec2(160, 160)),
    new ImageObject("images/wallObsidianLight.png", vec2(160, 160)),
    new ImageObject("images/wallRock.png", vec2(160, 160)),
    new ImageObject("images/wallRockBluetrim.png", vec2(160, 160)),
    new ImageObject("images/wallSandstone.png", vec2(160, 160)),
    new ImageObject("images/wallSandstoneKeyhole.png", vec2(160, 160)),
    new ImageObject("images/wallSteel.png", vec2(160, 160)),
    new ImageObject("images/wallSteelGreenlight.png", vec2(160, 160)),
    new ImageObject("images/wallTan.png", vec2(160, 160)),
    new ImageObject("images/wallTanRedlight.png", vec2(160, 160)),
    new ImageObject("images/wallTech.png", vec2(160, 160)),
    new ImageObject("images/wallTechServer.png", vec2(160, 160)),
];
wallColors = [
    "#ffff0077",
    "#00dd0077",
    "#dd00dd77",
    "#ff000077",
    "#dd000077",
    "#bbbb0077",
    // new walls with decorated variants
    "#dddddd77",
    "#dddddd77",
    "#dddddd77",
    "#dddddd77",
    "#dddddd77",
    "#dddddd77",
    "#dddddd77",
    "#dddddd77",
    "#dddddd77",
    "#dddddd77",
    "#dddddd77",
    "#dddddd77",
    "#dddddd77",
    "#dddddd77",
    "#dddddd77",
    "#dddddd77"
];
wall = [];

var wallCollisionPadding = 0.25;

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
            "#555555");
		}
    }

    addOffset(vec2)
    {
        this.p1.x += vec2.x;
        this.p1.y += vec2.y;
        this.p2.x += vec2.x;
        this.p2.y += vec2.y;
    }

    getCollValue(p, prevP, allowSectors)
    {
        if(typeof allowSectors == "undefined" || allowSectors == false)
        {
            if(this.type <= 0) return p;
            if(typeof this.sectorData.wallsLeft != "undefined"
            || typeof this.sectorData.wallsRight != "undefined") return p;
        }

        if(isPointOnLine(vec2(this.p1.x, this.p1.y),
        vec2(this.p2.x, this.p2.y), vec2(p.x, p.y), wallCollisionPadding))
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

    toString(goDeep)
    {
        if(isNaN(Math.floor(this.p1.x * 100.0)) || isNaN(Math.floor(this.p1.y * 100.0))) return "";

        var wallStrArr = [];
        
        wallStrArr.push(Math.floor(this.p1.x * 100.0).toString() + " " + Math.floor(this.p1.y * 100.0).toString() + " " +
            Math.floor(this.p2.x * 100.0).toString() + " " + Math.floor(this.p2.y * 100.0).toString() + " " +
            Math.floor(this.type).toString() + " ");

        if(this.type == 0)
        {
            if(typeof goDeep == "undefined" || goDeep == true)
            {
                if(typeof this.sectorData.wallsLeft != "undefined")
                {
                    wallStrArr.push(this.sectorData.wallsLeft.length.toString() + " ");
                    for(let i = 0; i < this.sectorData.wallsLeft.length; i++)
                        wallStrArr.push(this.sectorData.wallsLeft[i].toString(false));
                }
                else wallStrArr.push("0 ");

                if(typeof this.sectorData.wallsRight != "undefined")
                {
                    wallStrArr.push(this.sectorData.wallsRight.length.toString() + " ");
                    for(let i = 0; i < this.sectorData.wallsRight.length; i++)
                        wallStrArr.push(this.sectorData.wallsRight[i].toString(false));
                }
                else wallStrArr.push("0 ");

                if(typeof this.sectorData.sectorsLeft != "undefined")
                {
                    wallStrArr.push(this.sectorData.sectorsLeft.length.toString() + " ");
                    for(let i = 0; i < this.sectorData.sectorsLeft.length; i++)
                        wallStrArr.push(this.sectorData.sectorsLeft[i].toString(false));
                }
                else wallStrArr.push("0 ");

                if(typeof this.sectorData.sectorsRight != "undefined")
                {
                    wallStrArr.push(this.sectorData.sectorsRight.length.toString() + " ");
                    for(let i = 0; i < this.sectorData.sectorsRight.length; i++)
                        wallStrArr.push(this.sectorData.sectorsRight[i].toString(false));
                }
                else wallStrArr.push("0 ");
            }
            else
            {
                wallStrArr.push("0 0 0 0 ");
            }
        }

        var wallStr = "";
        for(let i = 0; i < wallStrArr.length; i++)
            wallStr += wallStrArr[i];
        
        return wallStr;
    }

    isPresentInActiveSector()
    {
        pos = getPositionSideInSector();

        if(pos < 0)
        {
            if(typeof activeSector.sectorData.wallsLeft != "undefined")
                for(let i = 0; i < activeSector.sectorData.wallsLeft.length; i++)
                    if(activeSector.sectorData.wallsLeft[i] == this) return true;
        }
        else if(pos > 0)
        {
            if(typeof activeSector.sectorData.wallsRight != "undefined")
                for(let i = 0; i < activeSector.sectorData.wallsRight.length; i++)
                    if(activeSector.sectorData.wallsRight[i] == this) return true;
        }
        return false;
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
}

function convertWallsToString(walls)
{
    var str = "";
    for(let i = walls.length - 1; i >= 0; i--)
    {
        if(walls[i].type == 0)
        {
            str += walls[i].toString(true);
        }
    }
    str += ".";
    return str;
}

function generateWallsFromString(walls, str)
{
    var values = str.split(' ');
    for(let i = 0; i < values.length;)
    {
        var newWall = new Wall();
        newWall.set(
            parseInt(values[i++] / 100.0),
            parseInt(values[i++] / 100.0),
            parseInt(values[i++] / 100.0),
            parseInt(values[i++] / 100.0)
        );
        newWall.type = parseInt(values[i++]);

        var newWallAdd = getAlreadyMadeWall(newWall, walls);
        if(typeof newWallAdd == "undefined")
        {
            walls.push(newWall);
        }
        else
        {
            newWall = newWallAdd;
        }

        if(newWall.type == 0)
        {
            var count = parseInt(values[i++]);
            if(count > 0) newWall.sectorData.wallsLeft = [];

            while(count > 0)
            {
                var sNewWall = new Wall();
                sNewWall.set(
                    parseInt(values[i++] / 100.0),
                    parseInt(values[i++] / 100.0),
                    parseInt(values[i++] / 100.0),
                    parseInt(values[i++] / 100.0)
                );
                sNewWall.type = parseInt(values[i++]);

                var wallToAdd = getAlreadyMadeWall(sNewWall, walls);
                if(typeof wallToAdd == "undefined")
                {
                    newWall.sectorData.wallsLeft.push(sNewWall);
                    walls.push(sNewWall);
                }
                else
                {
                    newWall.sectorData.wallsLeft.push(wallToAdd);
                }

                count--;
            }

            count = parseInt(values[i++]);
            if(count > 0) newWall.sectorData.wallsRight = [];

            while(count > 0)
            {
                var sNewWall = new Wall();
                sNewWall.set(
                    parseInt(values[i++] / 100.0),
                    parseInt(values[i++] / 100.0),
                    parseInt(values[i++] / 100.0),
                    parseInt(values[i++] / 100.0)
                );
                sNewWall.type = parseInt(values[i++]);

                var wallToAdd = getAlreadyMadeWall(sNewWall, walls);
                if(typeof wallToAdd == "undefined")
                {
                    newWall.sectorData.wallsRight.push(sNewWall);
                    walls.push(sNewWall);
                }
                else
                {
                    newWall.sectorData.wallsRight.push(wallToAdd);
                }

                count--;
            }

            count = parseInt(values[i++]);
            if(count > 0) newWall.sectorData.sectorsLeft = [];

            while(count > 0)
            {
                var sNewWall = new Wall();
                sNewWall.set(
                    parseInt(values[i++] / 100.0),
                    parseInt(values[i++] / 100.0),
                    parseInt(values[i++] / 100.0),
                    parseInt(values[i++] / 100.0)
                );
                sNewWall.type = parseInt(values[i++]);
                i += 4; //sectors got 4 zeros in the end

                var wallToAdd = getAlreadyMadeWall(sNewWall, walls);
                if(typeof wallToAdd == "undefined")
                {
                    newWall.sectorData.sectorsLeft.push(sNewWall);
                    walls.push(sNewWall);
                }
                else
                {
                    newWall.sectorData.sectorsLeft.push(wallToAdd);
                }

                count--;
            }

            count = parseInt(values[i++]);
            if(count > 0) newWall.sectorData.sectorsRight = [];

            while(count > 0)
            {
                var sNewWall = new Wall();
                sNewWall.set(
                    parseInt(values[i++] / 100.0),
                    parseInt(values[i++] / 100.0),
                    parseInt(values[i++] / 100.0),
                    parseInt(values[i++] / 100.0)
                );
                sNewWall.type = parseInt(values[i++]);
                i += 4; //sectors got 4 zeros in the end

                var wallToAdd = getAlreadyMadeWall(sNewWall, walls);
                if(typeof wallToAdd == "undefined")
                {
                    newWall.sectorData.sectorsRight.push(sNewWall);
                    walls.push(sNewWall);
                }
                else
                {
                    newWall.sectorData.sectorsRight.push(wallToAdd);
                }

                count--;
            }
        }

        if(typeof activeSector == "undefined")
            activeSector = walls[walls.length-1];
    }

    resetWallIndexes();

    console.log(walls.length);
}

function getAlreadyMadeWall(nw, walls)
{
    for(let i = 0; i < walls.length; i++)
    {
        if(nw.p1.x == walls[i].p1.x
        && nw.p1.y == walls[i].p1.y
        && nw.p2.x == walls[i].p2.x
        && nw.p2.y == walls[i].p2.y)
        {
            return walls[i];
        }
    }

    return undefined;
}

function getPositionSideInSector(sec, _plPos)
{
    //if params are not inserted...

    //...use active sector
    if(typeof sec == "undefined") sec = activeSector;

    //...and global player position
    if(typeof _plPos == "undefined") _plPos = plPos;

    // can still be undefined: FIXME
    if(typeof sec == "undefined" || typeof _plPos == "undefined") {
        console.log("missing sector or player position in getPositionSideInSector");
        return;
    }

    var Ax = sec.p1.x; var Ay = sec.p1.y;
    var Bx = sec.p2.x; var By = sec.p2.y;
    var X = _plPos.x; var Y = _plPos.y;
    Bx -= Ax; By -= Ay; X -= Ax; Y -= Ay;
    return ((Bx * Y) - (By * X));
}

function detectActiveSector(sector, _plPos)
{
    var pos = getPositionSideInSector(sector, _plPos);

    if(((pos < 0 && sector.sectorData.direction > 0)
        || (pos > 0 && sector.sectorData.direction < 0))
    && sector.sectorData.direction != 0)
    {
        activeSector = sector;
        activeSectorDetected = true;
    }

    return pos;
}

function drawSectorMapWallsLeft(sector, off)
{
    if(typeof sector.sectorData.wallsLeft != "undefined")
    {
        for(let i = 0; i < sector.sectorData.wallsLeft.length; i++)
        {
            if(sector.sectorData.wallsLeft[i].type != 0)
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
            if(sector.sectorData.wallsRight[i].type != 0)
            {
                sector.sectorData.wallsRight[i].addOffset(off);
                sector.sectorData.wallsRight[i].draw(renderer, undefined, plPos);
                sector.sectorData.wallsRight[i].addOffset(vec2(-off.x, -off.y));
            }
        }
    }
}

function sectorsMap(plPos, sec)
{
    var sector = undefined;
    if(typeof sec != "undefined") sector = sec;
    else if(typeof activeSector != "undefined") sector = activeSector;

    if(typeof sector != "undefined")
    {
        pos = detectActiveSector(sector, plPos);
        if(pos < 0)
        {
            sector.sectorData.direction = -1;
            if(activeSector == sector
                && typeof sector.sectorData.sectorsLeft != "undefined")
            {
                for(let i = 0; i < sector.sectorData.sectorsLeft.length; i++)
                    sectorsMap(plPos, sector.sectorData.sectorsLeft[i]);
            }
        }
        else
        {
            sector.sectorData.direction = 1;
            if(activeSector == sector
                && typeof sector.sectorData.sectorsRight != "undefined")
            {
                for(let i = 0; i < sector.sectorData.sectorsRight.length; i++)
                    sectorsMap(plPos, sector.sectorData.sectorsRight[i]);
            }
        }
    }
}

function drawSectorsMap(renderer, plPos, off, sec)
{
    var sector = undefined;
    if(typeof sec != "undefined") sector = sec;
    else if(typeof activeSector != "undefined") sector = activeSector;

    if(typeof sector != "undefined")
    {
        sector.addOffset(off);

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

        sector.addOffset(vec2(-off.x, -off.y));
    }
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

function collisionWithWallsInSector(currentPos, previousPos, sec)
{
    if(currentPos == previousPos) return currentPos;

    if(typeof sec == "undefined") sec = activeSector;

    if(typeof sec != "undefined")
    {
        var pos = getPositionSideInSector(sec, currentPos);

        if(pos < 0 && typeof sec.sectorData.wallsLeft != "undefined")
        {
            for(let i = 0; i < sec.sectorData.wallsLeft.length; i++)
            {
                if(typeof sec.sectorData.wallsLeft[i].sectorData.wallsLeft == "undefined"
                && typeof sec.sectorData.wallsLeft[i].sectorData.wallsRight == "undefined"
                && sec.sectorData.wallsLeft[i].type > 0)
                {
                    currentPos = sec.sectorData.wallsLeft[i].getCollValue(currentPos, previousPos);
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
                    currentPos = sec.sectorData.wallsRight[i].getCollValue(currentPos, previousPos);
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

    currentPos = sec.getCollValue(currentPos, previousPos, true);
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

function addWallToSector(w, sec)
{
    if(typeof sec == "undefined") sec = activeSector;

    var pos = getPositionSideInSector(sec, w.p1) + getPositionSideInSector(sec, w.p2);

    if(pos < 0)
    {
        if(w.type == 0)
        {
            if(typeof sec.sectorData.sectorsLeft == "undefined")
                sec.sectorData.sectorsLeft = [];

            if(sec == activeSector)
            {
                addWallToSector(sec, w);
                if(typeof sec.sectorData.wallsLeft != "undefined")
                {
                    for(let i = 0; i < sec.sectorData.wallsLeft.length; i++)
                    {
                        addWallToSector(sec.sectorData.wallsLeft[i], w);
                    }
                }
                else if(typeof sec.sectorData.wallsRight != "undefined")
                {
                    for(let i = 0; i < sec.sectorData.wallsRight.length; i++)
                    {
                        addWallToSector(sec.sectorData.wallsRight[i], w);
                    }
                }
            }

            sec.sectorData.sectorsLeft.push(w);
        }
        else
        {
            if(typeof sec.sectorData.wallsLeft == "undefined")
                sec.sectorData.wallsLeft = [];

            sec.sectorData.wallsLeft.push(w);
        }
    }
    else if(pos > 0)
    {
        if(w.type == 0)
        {
            if(typeof sec.sectorData.sectorsRight == "undefined")
                sec.sectorData.sectorsRight = [];

            if(sec == activeSector)
            {
                addWallToSector(sec, w);
                if(typeof sec.sectorData.wallsLeft != "undefined")
                {
                    for(let i = 0; i < sec.sectorData.wallsLeft.length; i++)
                    {
                        addWallToSector(sec.sectorData.wallsLeft[i], w);
                    }
                }
                else if(typeof sec.sectorData.wallsRight != "undefined")
                {
                    for(let i = 0; i < sec.sectorData.wallsRight.length; i++)
                    {
                        addWallToSector(sec.sectorData.wallsRight[i], w);
                    }
                }
            }

            sec.sectorData.sectorsRight.push(w);
        }
        else
        {
            if(typeof sec.sectorData.wallsRight == "undefined")
                sec.sectorData.wallsRight = [];

            sec.sectorData.wallsRight.push(w);
        }
    }
}

function deleteWallFromAllSectors(w)
{
    for(let i = 0; i < wall.length; i++)
    {
        //if(wall[i].type == 0)
        {
            if(typeof wall[i].sectorData.wallsLeft != "undefined")
            {
                for(let n = 0; n < wall[i].sectorData.wallsLeft.length; n++)
                {
                    if(wall[i].sectorData.wallsLeft[n] == w)
                    {
                        wall[i].sectorData.wallsLeft.splice(n, 1);
                        break;
                        //n--;
                    }
                }
            }
            else if(typeof wall[i].sectorData.wallsRight != "undefined")
            {
                for(let n = 0; n < wall[i].sectorData.wallsRight.length; n++)
                {
                    if(wall[i].sectorData.wallsRight[n] == w)
                    {
                        wall[i].sectorData.wallsRight.splice(n, 1);
                        break;
                        //n--;
                    }
                }
            }
        }
        //else
            //break;
    }
}