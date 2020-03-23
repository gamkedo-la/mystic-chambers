
var entPosSegment = 45.0;
var entScaleFactor = 40.0;
var entAngleOffset = 270.0;
var entXOffset = 0.0;
var entMinRenderAngle = 155.0;
var entMaxRenderAngle = 205.0;

var maxEntityVisibilityDistance = 250.0;

var entCollisionSize = 4.0;
var entAfterCollisionGap = 0.25;
var entCollisionAngleDiff = degToRad(-2.5);

//Entity IDs
const ENT_TECHTORCH = 0;
//
const ENT_HEALTHBOX = 1;
const ENT_REDKEY = 2;
const ENT_GREENKEY = 3;
const ENT_BLUEKEY = 4;
const ENT_REVOLVERGUN = 5;
const ENT_REVOLVERAMMO = 6;
const ENT_WINCHESTERGUN = 7;
const ENT_WINCHESTERAMMO = 8;
//
const ENT_FIRESKULL = 9;
//

entColor = [
    "#cccc0090",

    "#ee555590",
    "#ff000090",
    "#00ff0090",
    "#0000ff90",
    "#B7410E90",
    "#A6300D90",
    "#96987990",
    "#85876890",

    "#ee440090",
];

entImg = [
    //DECOR IMAGES START
        new ImageObject("images/tech_torch_x10.png", TEXTURESIZEVEC2),
    //DECOR IMAGES END

    //ITEM IMAGES START
        new ImageObject("images/healthBox.png", vec2(1280, 160)),
        new ImageObject("images/redKey.png", vec2(1280, 160)),
        new ImageObject("images/greenKey.png", vec2(1280, 160)),
        new ImageObject("images/blueKey.png", vec2(1280, 160)),
        new ImageObject("images/revolverGun.png", vec2(1280, 160)),
        new ImageObject("images/revolverAmmo.png", vec2(1280, 160)),
        new ImageObject("images/winchesterGun.png", vec2(1280, 160)),
        new ImageObject("images/winchesterAmmo.png", vec2(1280, 160)),
    //ITEM IMAGES END

    //ENEMY IMAGES START
        new ImageObject("images/fireSkullIdle.png", vec2(1280, 160)),
    //ENEMY IMAGES END
];

entAttackImg = [

];

entDamageImg = [

];

//Requires Sprite
class Entity
{
    constructor()
    {
        this.p = vec2(0.0, 0.0);
        this.size = 4.0;
        this.angle = 0.0;
        this.sprite = new Sprite(tr());
        this.renderOffset = vec2(0.0, 0.0);
        this.id = -1;
    }

    set(x, y, id)
    {
        this.p.x = x;
        this.p.y = y;
        this.id = id;

        this.sprite.imageObject = entImg[this.id];
    }

    draw(renderer, plRay, line)
    {
        if(line)
        {
            drawLine(renderer,
                vec2(this.p.x - (Math.cos(degToRad(this.angle)) * this.size),
                this.p.y - (Math.sin(degToRad(this.angle)) * this.size)),
                vec2(this.p.x + (Math.cos(degToRad(this.angle)) * this.size),
                this.p.y + (Math.sin(degToRad(this.angle)) * this.size)), entColor[this.id]);

            drawCircle(renderer, this.p, entCollisionSize, false, entColor[this.id]);
        }
        else
        {
            var plRayAngle = plRay.angle;
            var dist = plRay.p.distance(this.p);
            var ang = plRay.p.angle(this.p);
            var angDiff = radToDeg(plRay.p.angle(this.p)) - plRayAngle;

            if(dist < maxEntityVisibilityDistance
                && Math.abs(angDiff) > entMinRenderAngle
                && Math.abs(angDiff) < entMaxRenderAngle)
            {
                var posRatio = radToDeg(ang + (Math.PI/2.0))
                    - (plRayAngle + entAngleOffset);

                var imageSide = radToDeg(ang + Math.PI) / (360.0 /
                    (entImg[this.id].size.x / 160.0));

                this.sprite.imageObject = entImg[this.id];

                renderer.globalAlpha = round(1.0 - (dist / maxEntityVisibilityDistance), 0.2, 0);

                this.sprite.transform.scale = vec2(entScaleFactor / dist, entScaleFactor / dist);
                this.sprite.transform.position = vec2(
                    (((window.innerWidth/2) - ((this.sprite.transform.scale.x/2) * this.renderOffset.x))
                    + posRatio * (window.innerWidth/entPosSegment)) + entXOffset,
                    (window.innerHeight/2) - ((this.sprite.transform.scale.y/2) * this.renderOffset.y));
                this.sprite.drawScIn(vec2(Math.floor(imageSide) * 160, 0), TEXTURESIZEVEC2);

                renderer.globalAlpha = 1.0;
            }
        }
    }

    getCollValue(plP)
    {
        var dist = plP.distance(this.p);

        if(dist < entCollisionSize)
        {
            return vec2((entCollisionSize + entAfterCollisionGap - dist) * Math.cos(this.angle + entCollisionAngleDiff),
                (entCollisionSize + entAfterCollisionGap - dist) * Math.sin(this.angle + entCollisionAngleDiff));
        }
        
        return vec2(0, 0);
    }

    addOffset(vec2)
    {
        this.p.x += vec2.x;
        this.p.y += vec2.y;
    }
}

var entities = [];

function drawEntities(renderer, plRay, line)
{
    //z indexing before draw
    entities.sort(
        function(entA, entB) {
            return plRay.p.distance(entA.p) < plRay.p.distance(entB.p) ? 1 : -1;
        }
    );

    for (var num = 0, max = this.entities.length; num < max; num++) 
    {
        if(line) entities[num].addOffset(vec2(-plRay.p.x + (window.innerWidth/2), -plRay.p.y + (window.innerHeight/2)));
        entities[num].draw(renderer, plRay, line);
        if(line) entities[num].addOffset(vec2(plRay.p.x - (window.innerWidth/2), plRay.p.y - (window.innerHeight/2)));
    }
}

function drawEntitiesInSector(sector, pos, renderer, plRay)
{
    if(typeof sector != "undefined")
    {
        if(pos < 0)
        {
            if(typeof sector.sectorData.entitiesLeft != "undefined")
            {
                sector.sectorData.entitiesLeft.sort(
                    function(entA, entB) {
                        return plRay.p.distance(entA.p) < plRay.p.distance(entB.p) ? 1 : -1;
                    }
                );

                for(let i = 0; i < sector.sectorData.entitiesLeft.length; i++)
                {
                    //if(line) sector.sectorData.entitiesLeft[i].addOffset(vec2(-plRay.p.x + (window.innerWidth/2), -plRay.p.y + (window.innerHeight/2)));
                    sector.sectorData.entitiesLeft[i].draw(renderer, plRay, false);
                    //if(line) sector.sectorData.entitiesLeft[i].addOffset(vec2(plRay.p.x - (window.innerWidth/2), plRay.p.y - (window.innerHeight/2)));
                }
            }
        }
        else
        {
            if(typeof sector.sectorData.entitiesRight != "undefined")
            {
                sector.sectorData.entitiesRight.sort(
                    function(entA, entB) {
                        return plRay.p.distance(entA.p) < plRay.p.distance(entB.p) ? 1 : -1;
                    }
                );

                for(let i = 0; i < sector.sectorData.entitiesRight.length; i++)
                {
                    //if(line) sector.sectorData.entitiesRight[i].addOffset(vec2(-plRay.p.x + (window.innerWidth/2), -plRay.p.y + (window.innerHeight/2)));
                    sector.sectorData.entitiesRight[i].draw(renderer, plRay, false);
                    //if(line) sector.sectorData.entitiesRight[i].addOffset(vec2(plRay.p.x - (window.innerWidth/2), plRay.p.y - (window.innerHeight/2)));
                }
            }
        }
    }
}

function removeEntity(remEnt)
{
    for( let i = 0; i < entities.length; i++)
    { 
        if (entities[i] === remEnt)
        {
          entities.splice(i, 1); 
          break;
        }
    }
}

function removeEntityInSector(remEnt)
{
    if(typeof activeSector != "undefined")
    {
        var Ax = activeSector.p1.x; var Ay = activeSector.p1.y;
        var Bx = activeSector.p2.x; var By = activeSector.p2.y;
        var X = plPos.x; var Y = plPos.y;
        Bx -= Ax; By -= Ay; X -= Ax; Y -= Ay;
        var pos = (Bx * Y) - (By * X);

        if(pos < 0)
        {
            if(typeof activeSector.sectorData.entitiesLeft != "undefined")
            {
                for( let i = 0; i < activeSector.sectorData.entitiesLeft.length; i++)
                { 
                    if (activeSector.sectorData.entitiesLeft[i] === remEnt)
                    {
                        activeSector.sectorData.entitiesLeft.splice(i, 1); 
                        //break;
                    }
                }
            }
        }
        else
        {
            if(typeof activeSector.sectorData.entitiesRight != "undefined")
            {
                for( let i = 0; i < activeSector.sectorData.entitiesRight.length; i++)
                { 
                    if (activeSector.sectorData.entitiesRight[i] === remEnt)
                    {
                        activeSector.sectorData.entitiesRight.splice(i, 1); 
                        //break;
                    }
                }
            }
        }
    }
}

function isEntityInsideWalls(ent, walls, otherSectors, sector)
{
    var wallsDone = [];
    var totalWallsToBeDone = walls.length + 1;
    if(typeof otherSectors != "undefined") totalWallsToBeDone += otherSectors.length;
    var checkerLength = 1000;
    for(let r = 0; r < 360; r+=5)
    {
        var x1 = ent.p.x
        var y1 = ent.p.y;
        var x2 = x1 + (checkerLength * Math.cos(degToRad(r)));
        var y2 = y1 + (checkerLength * Math.sin(degToRad(r)));

        var wallIntersectCount = 0;

        for(let i = 0; i < walls.length; i++)
        {
            var skipThisOne = false;
            for(let d = 0; d < wallsDone.length; d++)
            {
                if(wallsDone[d] == walls[i])
                {
                    skipThisOne = true;
                    break;
                }
            }
            if(skipThisOne) continue;

            if(isLineOnLine(
                x1, y1, x2, y2,
                walls[i].p1.x, walls[i].p1.y, walls[i].p2.x, walls[i].p2.y))
            {
                wallsDone.push(walls[i]);
                wallIntersectCount++;
            }
        }

        if(typeof otherSectors != "undefined")
        {
            for(let i = 0; i < otherSectors.length; i++)
            {
                var skipThisOne = false;
                for(let d = 0; d < wallsDone.length; d++)
                {
                    if(wallsDone[d].x1 == otherSectors[i])
                    {
                        skipThisOne = true;
                        break;
                    }
                }
                if(skipThisOne) continue;

                if(isLineOnLine(
                    x1, y1, x2, y2,
                    otherSectors[i].p1.x, otherSectors[i].p1.y,
                    otherSectors[i].p2.x, otherSectors[i].p2.y))
                {
                    wallsDone.push(otherSectors[i]);
                    wallIntersectCount++;
                }
            }
        }

        var skipThisOne = false;
        for(let d = 0; d < wallsDone.length; d++)
        {
            if(wallsDone[d] == sector)
            {
                skipThisOne = true;
                break;
            }
        }
        if(!skipThisOne)
        {
            if(isLineOnLine(
                x1, y1, x2, y2,
                sector.p1.x, sector.p1.y,
                sector.p2.x, sector.p2.y))
            {
                wallsDone.push(sector);
                wallIntersectCount++;
            }
        }

        if(wallIntersectCount > 1) return false;
    }
    return wallsDone.length >= totalWallsToBeDone;
}

var entitiesInSectorSet = [];
function setEntitiesInSectors(sec)
{
    var sector = undefined;
    if(typeof sec != "undefined")
        sector = sec;
    else if(typeof activeSector != "undefined")
        sector = activeSector;

    for(let i = 0; i < entitiesInSectorSet.length; i++)
        if(sector == entitiesInSectorSet[i]) return;
    entitiesInSectorSet.push(sector);

    if(typeof sector != "undefined")
    {
        sector.sectorData.entitiesLeft = [];
        sector.sectorData.entitiesRight = [];

        for(let i = 0; i < entities.length; i++)
        {
            if(isEntityInsideWalls(entities[i], sector.sectorData.wallsLeft,
                sector.sectorData.sectorsLeft, sector))
            {
                sector.sectorData.entitiesLeft.push(entities[i]);
            }
        }

        if(typeof sector.sectorData.sectorsLeft != "undefined")
        {
            for(let i = 0; i < sector.sectorData.sectorsLeft.length; i++)
            {
                setEntitiesInSectors(sector.sectorData.sectorsLeft[i]);
            }
        }

        for(let i = 0; i < entities.length; i++)
        {
            if(isEntityInsideWalls(entities[i], sector.sectorData.wallsRight,
                sector.sectorData.sectorsRight, sector))
            {
                sector.sectorData.entitiesRight.push(entities[i]);
            }
        }

        if(typeof sector.sectorData.sectorsRight != "undefined")
        {
            for(let i = 0; i < sector.sectorData.sectorsRight.length; i++)
            {
                setEntitiesInSectors(sector.sectorData.sectorsRight[i]);
            }
        }
    }
}