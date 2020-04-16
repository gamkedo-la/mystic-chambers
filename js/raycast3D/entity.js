class EntityIDProperties
{
    constructor()
    {
        this.color = "#ff00ff90";
        this.idleImg = new ImageObject("images/unknown_id.png", vec2(160, 160));
        this.attackImg = new ImageObject("images/unknown_id.png", vec2(160, 160));
        this.damageImg = new ImageObject("images/unknown_id.png", vec2(160, 160));
        this.renderOffset = vec2();
        this.ai = function() {};
    }
}
var entProp = [ new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties(), new EntityIDProperties() ];

var entPosSegment = 45.0;
var entScaleFactor = 40.0;
var entAngleOffset = 270.0;
var entXOffset = 0.0;
var entMinRenderAngle = 155.0;
var entMaxRenderAngle = 205.0;
var entCircleDrawSize = 2;
var maxEntityVisibilityDistance = 250.0;
var entCollisionSize = 4.0;
var entAfterCollisionGap = 0.25;
var entCollisionAngleDiff = degToRad(-2.5);

//////////////////////////////////////////////////////
// Entity IDs (Order: Decor, Items, Enemies) --START--
//////////////////////////////////////////////////////
// DECORATIONS
// ID 0 to 9
const decorStartType = 0;

const ENT_TECHTORCH = 0;
entProp[ENT_TECHTORCH].color = "#cccc0090";
entProp[ENT_TECHTORCH].idleImg = new ImageObject("images/techTorch.png", vec2(160, 160));
entProp[ENT_TECHTORCH].renderOffset = vec2(0,-100);

const ENT_GRASS1 = 1;
entProp[ENT_GRASS1].color = "#00aa0090";
entProp[ENT_GRASS1].idleImg = new ImageObject("images/grass1.png", vec2(1280, 160));
entProp[ENT_GRASS1].renderOffset = vec2(0,-100);

const decorTotalTypes = 10;
//////////////////////////////////////////////////////
// ITEMS
// ID 10 to 39
const itemStartType = 10;

const ENT_HEALTHBOX = 10;
entProp[ENT_HEALTHBOX].color = "#ee555590";
entProp[ENT_HEALTHBOX].idleImg = new ImageObject("images/healthBox.png", vec2(1280, 160));
entProp[ENT_HEALTHBOX].renderOffset = vec2(0,-100);
entProp[ENT_HEALTHBOX].ai = aiSpinningBobbing;

const ENT_REDKEY = 11;
entProp[ENT_REDKEY].color = "#aa000090";
entProp[ENT_REDKEY].idleImg = new ImageObject("images/redKey.png", vec2(1280, 160));
entProp[ENT_REDKEY].renderOffset = vec2(0,-100);
entProp[ENT_REDKEY].ai = aiSpinningBobbing;

const ENT_GREENKEY = 12;
entProp[ENT_GREENKEY].color = "#00aa0090";
entProp[ENT_GREENKEY].idleImg = new ImageObject("images/greenKey.png", vec2(1280, 160));
entProp[ENT_GREENKEY].renderOffset = vec2(0,-100);
entProp[ENT_GREENKEY].ai = aiSpinningBobbing;

const ENT_BLUEKEY = 13;
entProp[ENT_BLUEKEY].color = "#0000aa90";
entProp[ENT_BLUEKEY].idleImg = new ImageObject("images/blueKey.png", vec2(1280, 160));
entProp[ENT_BLUEKEY].renderOffset = vec2(0,-100);
entProp[ENT_BLUEKEY].ai = aiSpinningBobbing;

const ENT_REVOLVERGUN = 14;
entProp[ENT_REVOLVERGUN].color = "#B7410E90";
entProp[ENT_REVOLVERGUN].idleImg = new ImageObject("images/revolverGun.png", vec2(1280, 160));
entProp[ENT_REVOLVERGUN].renderOffset = vec2(0,-100);
entProp[ENT_REVOLVERGUN].ai = aiSpinningBobbing;

const ENT_REVOLVERAMMO = 15;
entProp[ENT_REVOLVERAMMO].color = "#A6300D90";
entProp[ENT_REVOLVERAMMO].idleImg = new ImageObject("images/revolverAmmo.png", vec2(1280, 160));
entProp[ENT_REVOLVERAMMO].renderOffset = vec2(0,-100);
entProp[ENT_REVOLVERAMMO].ai = aiSpinningBobbing;

const ENT_WINCHESTERGUN = 16;
entProp[ENT_WINCHESTERGUN].color = "#96987990";
entProp[ENT_WINCHESTERGUN].idleImg = new ImageObject("images/winchesterGun.png", vec2(1280, 160));
entProp[ENT_WINCHESTERGUN].renderOffset = vec2(0,-100);
entProp[ENT_WINCHESTERGUN].ai = aiSpinningBobbing;

const ENT_WINCHESTERAMMO = 17;
entProp[ENT_WINCHESTERAMMO].color = "#85876890";
entProp[ENT_WINCHESTERAMMO].idleImg = new ImageObject("images/winchesterAmmo.png", vec2(1280, 160));
entProp[ENT_WINCHESTERAMMO].renderOffset = vec2(0,-100);
entProp[ENT_WINCHESTERAMMO].ai = aiSpinningBobbing;

const ENT_BARREL_RED = 18;
entProp[ENT_BARREL_RED].color = "#99222290";
entProp[ENT_BARREL_RED].idleImg = new ImageObject("images/barrelRed.png", vec2(160, 160));
entProp[ENT_BARREL_RED].renderOffset = vec2(0,-100);
entProp[ENT_BARREL_RED].ai = function() {};

const ENT_BARREL_STEEL = 19;
entProp[ENT_BARREL_STEEL].color = "#66666690";
entProp[ENT_BARREL_STEEL].idleImg = new ImageObject("images/barrelSteel.png", vec2(160, 160));
entProp[ENT_BARREL_STEEL].renderOffset = vec2(0,-100);
entProp[ENT_BARREL_STEEL].ai = function() {};

const ENT_SPIKES = 20;
entProp[ENT_SPIKES].color = "#88446690";
entProp[ENT_SPIKES].idleImg = new ImageObject("images/spikes.png", vec2(1280, 160));
entProp[ENT_SPIKES].renderOffset = vec2(0,-100);
entProp[ENT_SPIKES].ai = function() {};

const ENT_PILLAR = 21;
entProp[ENT_PILLAR].color = "#ffcc0090";
entProp[ENT_PILLAR].idleImg = new ImageObject("images/pillar.png", vec2(1280, 160));
entProp[ENT_PILLAR].renderOffset = vec2(0,-100);
entProp[ENT_PILLAR].ai = function() {};

const ENT_PILLAR_BROKEN = 22;
entProp[ENT_PILLAR_BROKEN].color = "#dd990090";
entProp[ENT_PILLAR_BROKEN].idleImg = new ImageObject("images/pillarBroken.png", vec2(1280, 160));
entProp[ENT_PILLAR_BROKEN].renderOffset = vec2(0,-100);
entProp[ENT_PILLAR_BROKEN].ai = function() {};

const ENT_GRAVESTONE = 23;
entProp[ENT_GRAVESTONE].color = "#cc00dd90";
entProp[ENT_GRAVESTONE].idleImg = new ImageObject("images/gravestone.png", vec2(1280, 160));
entProp[ENT_GRAVESTONE].renderOffset = vec2(0,-100);
entProp[ENT_GRAVESTONE].ai = function() {};

const ENT_FIRE = 24;
entProp[ENT_FIRE].color = "#ff444490";
entProp[ENT_FIRE].idleImg = new ImageObject("images/fire.png", vec2(640, 160));
entProp[ENT_FIRE].renderOffset = vec2(0,-100);
entProp[ENT_FIRE].ai = aiSpinning;

const ENT_FIRE_COLD = 25;
entProp[ENT_FIRE_COLD].color = "#ff44ff90";
entProp[ENT_FIRE_COLD].idleImg = new ImageObject("images/coldFire.png", vec2(640, 160));
entProp[ENT_FIRE_COLD].renderOffset = vec2(0,-100);
entProp[ENT_FIRE_COLD].ai = aiSpinning;

const ENT_FIRE_MYSTIC = 26;
entProp[ENT_FIRE_MYSTIC].color = "#44ffff90";
entProp[ENT_FIRE_MYSTIC].idleImg = new ImageObject("images/mysticFire.png", vec2(640, 160));
entProp[ENT_FIRE_MYSTIC].renderOffset = vec2(0,-100);
entProp[ENT_FIRE_MYSTIC].ai = aiSpinning;

const ENT_WATERDROPS = 27;
entProp[ENT_WATERDROPS].color = "#66666690";
entProp[ENT_WATERDROPS].idleImg = new ImageObject("images/waterDrop.png", vec2(160, 160));
entProp[ENT_WATERDROPS].renderOffset = vec2(0,-100);
entProp[ENT_WATERDROPS].ai = aiDripping;

const itemTotalTypes = 30;
//////////////////////////////////////////////////////
// ENEMIES: id 40 to 44
const enemyStartType = 40;

const ENT_FIRESKULL = 40;
entProp[ENT_FIRESKULL].color = "#eecc0090";
entProp[ENT_FIRESKULL].idleImg = new ImageObject("images/fireSkullIdle.png", vec2(1280, 160));
entProp[ENT_FIRESKULL].renderOffset = vec2();
entProp[ENT_FIRESKULL].ai = aiSeek;

const enemyTotalTypes = 5;
//////////////////////////////////////////////////////
//Entity IDs --END--
//////////////////////////////////////////////////////

//Requires Sprite
class Entity
{
    constructor()
    {
        this.p = vec2(0.0, 0.0);
        this.angle = 0.0;
        this.sprite = new Sprite(tr());
        this.id = -1;
        this.ai = undefined; // an optional function
        this.aimAngleRadians = 0; // the angle an entity is looking
        this.sector = undefined; //the sector in which this entity is present
        this.bobbingFactor = 1.0;
    }

    set(x, y, id)
    {
        this.p.x = x;
        this.p.y = y;
        this.id = id;

        if(!isNaN(this.id)) this.sprite.imageObject = entProp[this.id].idleImg;
    }

    setIDProperties() { this.ai = entProp[this.id].ai; }

    draw(renderer, plRay, circleOnly)
    {
        if (this.ai && (!mapMode || debugEntities)) this.ai(plRay);
        
        if(circleOnly)
        {
            drawCircle(renderer, this.p, entCircleDrawSize, false, entProp[this.id].color);
            // used to debug AI
            if (debugEntities && this.debugTarget) {
                drawLine(renderer, this.p, this.debugTarget, "rgba(255,0,0,0.5)");
            }

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

                // added this.angle to account for entity look angle
                // to draw sprites with a rotational offset from player
                var spriteAngle = ang + this.aimAngleRadians + Math.PI;
                // cap to 0..360
                if (spriteAngle>Math.PI*2) spriteAngle -= Math.PI*2;
                if (spriteAngle<0) spriteAngle += Math.PI*2;
                // FIXME: it looks like the art on the skull is rotated
                // 90 or 180 compared to movement vector
                // watch explorer_fireSkullEnt in-game to check
                
                var imageSide = radToDeg(spriteAngle) / (360.0 /
                    (entProp[this.id].idleImg.size.x / 160.0));

                this.sprite.imageObject = entProp[this.id].idleImg;

                renderer.globalAlpha = round(1.0 - (dist / maxEntityVisibilityDistance), 0.2, 0);

                this.sprite.transform.scale = vec2(entScaleFactor / dist, entScaleFactor / dist);
                this.sprite.transform.position = vec2(
                    (((window.innerWidth/2) - ((this.sprite.transform.scale.x/2) * entProp[this.id].renderOffset.x))
                    + posRatio * (window.innerWidth/entPosSegment)) + entXOffset,
                    (window.innerHeight/2) - ((this.sprite.transform.scale.y/2) * (entProp[this.id].renderOffset.y * this.bobbingFactor)));
                this.sprite.drawScIn(vec2(Math.floor(imageSide) * 160, 0), vec2(160, 160));

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

    toString()
    {
        return this.p.x + " " + this.p.y + " " + this.id + " ";
    }
}

var entities = [];

function convertEntitiesToString(entities)
{
    var str = "";
    for(let i = 0; i < entities.length; i++)
    {
        str += entities[i].toString();
    }
    str += "&";
    return str;
}

function generateEntitiesFromString(str)
{
    var values = str.split(' ');
    for(let i = 0; i < values.length;)
    {
        var newEntity = new Entity();

        newEntity.set(
            parseInt(values[i++]),
            parseInt(values[i++]),
            parseInt(values[i++])
        );

        if(!isNaN(newEntity.id))
            newEntity.ai = entProp[newEntity.id].ai;

        if(newEntity.id >= decorStartType
        && newEntity.id < decorStartType + decorTotalTypes)
        {
            decor.ents.push(newEntity);
        }
        if(newEntity.id >= itemStartType
        && newEntity.id < itemStartType + itemTotalTypes)
        {
            items.ents.push(newEntity);
        }
        if(newEntity.id >= enemyStartType
        && newEntity.id < enemyStartType + enemyTotalTypes)
        {
            enemies.ents.push(newEntity);
        }

        entities.push(newEntity);
    }

    entitiesInSectorSet = [];
    setEntitiesInSectors();
    deleteEntitiesOutsideSector();
    decor.removeIfNotInEntities();
    items.removeIfNotInEntities();
    enemies.removeIfNotInEntities();
}

function drawEntities(renderer, plRay, line)
{
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
                    sector.sectorData.entitiesLeft[i].draw(renderer, plRay, false);
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
                    sector.sectorData.entitiesRight[i].draw(renderer, plRay, false);
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

function removeEntityInSector(remEnt, sec)
{
    if(typeof sec == "undefined") sec = activeSector;

    if(typeof sec != "undefined")
    {
        if(typeof sec.sectorData.entitiesLeft != "undefined")
        {
            for( let i = 0; i < sec.sectorData.entitiesLeft.length; i++)
            { 
                if (sec.sectorData.entitiesLeft[i] === remEnt)
                {
                    sec.sectorData.entitiesLeft.splice(i, 1); 
                }
            }
        }
        if(typeof sec.sectorData.entitiesRight != "undefined")
        {
            for( let i = 0; i < sec.sectorData.entitiesRight.length; i++)
            { 
                if (sec.sectorData.entitiesRight[i] === remEnt)
                {
                    sec.sectorData.entitiesRight.splice(i, 1); 
                }
            }
        }
        if(sec == activeSector && typeof sec.sectorData.sectorsLeft != "undefined")
        {
            for( let i = 0; i < sec.sectorData.sectorsLeft.length; i++)
            { 
                removeEntityInSector(remEnt, sec.sectorData.sectorsLeft[i]);
            }
        }
        if(sec == activeSector && typeof sec.sectorData.sectorsRight != "undefined")
        {
            for( let i = 0; i < sec.sectorData.sectorsRight.length; i++)
            { 
                removeEntityInSector(remEnt, sec.sectorData.sectorsRight[i]);
            }
        }
    }
}

function removeEntityInAllSectors()
{
    for(let s = 0; s < wall.length; s++)
    {
        if(wall[s].type > 0) break;

        wall[s].sectorData.entitiesLeft = [];
        wall[s].sectorData.entitiesRight = [];
    }
}

function isEntityInsideWalls(ent, walls, otherSectors, sector)
{
    var wallsDone = [];
    var totalWallsToBeDone = walls.length + 1;
    if(typeof otherSectors != "undefined") totalWallsToBeDone += otherSectors.length;
    var checkerLength = 1000;
    var skipThisOne = false;
    for(let r = 0; r < 360; r+=5)
    {
        var x1 = ent.p.x;
        var y1 = ent.p.y;
        var x2 = x1 + (checkerLength * Math.cos(degToRad(r)));
        var y2 = y1 + (checkerLength * Math.sin(degToRad(r)));

        var wallIntersectCount = 0;

        for(let i = 0; i < walls.length; i++)
        {
            skipThisOne = false;
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
                skipThisOne = false;
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

        skipThisOne = false;
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
            if(typeof sector.sectorData.wallsLeft != "undefined"
            && isEntityInsideWalls(entities[i], sector.sectorData.wallsLeft,
                sector.sectorData.sectorsLeft, sector))
            {
                sector.sectorData.entitiesLeft.push(entities[i]);
                entities[i].sector = sector;
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
            if(typeof sector.sectorData.wallsRight != "undefined"
            && isEntityInsideWalls(entities[i], sector.sectorData.wallsRight,
                sector.sectorData.sectorsRight, sector))
            {
                sector.sectorData.entitiesRight.push(entities[i]);
                entities[i].sector = sector;
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

function deleteEntitiesOutsideSector()
{
    for(let i = 0; i < entities.length; i++)
    {
        if(typeof entities[i].sector == "undefined")
        {
            entities.splice(i, 1);
            i--;
        }
    }
}