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
// DECORATIONS: id 0..9
const decorStartType = 0;
const ENT_TECHTORCH = 0;
const ENT_GRASS1 = 1;
const ENT_DECORATION_3 = 2; // feel free to rename and start using
const ENT_DECORATION_4 = 3;
const ENT_DECORATION_5 = 4;
const ENT_DECORATION_6 = 5;
const ENT_DECORATION_7 = 6;
const ENT_DECORATION_8 = 7;
const ENT_DECORATION_9 = 8;
const ENT_DECORATION_10 = 9;
const decorTotalTypes = 10; // id 0-20
//////////////////////////////////////////////////////
// ITEMS: id 10..39
const itemStartType = 10;
const ENT_HEALTHBOX = 10;
const ENT_REDKEY = 11;
const ENT_GREENKEY = 12;
const ENT_BLUEKEY = 13;
const ENT_REVOLVERGUN = 14;
const ENT_REVOLVERAMMO = 15;
const ENT_WINCHESTERGUN = 16;
const ENT_WINCHESTERAMMO = 17;
const ENT_BARREL_RED = 18;
const ENT_BARREL_STEEL = 19;
const ENT_SPIKES = 20;
const ENT_PILLAR = 21;
const ENT_PILLAR_BROKEN = 22;
const ENT_GRAVESTONE = 23;
const ENT_FIRE = 24;
const ENT_FIRE_COLD = 25;
const ENT_FIRE_MYSTIC = 26;
// free free to rename these for your use
const ENT_WATERDROPS = 27;
const ENT_UNUSED_1 = 28;
const ENT_UNUSED_2 = 29;
const ENT_UNUSED_3 = 30;
const ENT_UNUSED_4 = 31;
const ENT_UNUSED_5 = 32;
const ENT_UNUSED_6 = 33;
const ENT_UNUSED_7 = 34;
const ENT_UNUSED_8 = 35;
const ENT_UNUSED_9 = 36;
const ENT_UNUSED_10 = 37;
const ENT_UNUSED_11 = 38;
const ENT_UNUSED_12 = 39;
const itemTotalTypes = 30; // id 10-39
//////////////////////////////////////////////////////
// ENEMIES: id 40..??
const enemyStartType = 40;
const ENT_FIRESKULL = 40;
const enemyTotalTypes = 1;
//////////////////////////////////////////////////////
//Entity IDs --END--
//////////////////////////////////////////////////////

entColor = [
    // decorations ID 0-9
    "#cccc0090",
    "#00aa0090",
    "#00aa0090",
    "#00aa0090",
    "#00aa0090",
    "#00aa0090",
    "#00aa0090",
    "#00aa0090",
    "#00aa0090",
    "#00aa0090",
    // items ID 10-39
    "#ee555590", // ID 10
    "#aa000090",
    "#00ff0090",
    "#0000ff90",
    "#B7410E90",
    "#A6300D90",
    "#96987990",
    "#85876890",
    "#85876890",
    "#85876890",
    "#ffcc0090", // ID 20
    "#cc00dd90",
    "#cc00dd90",
    "#55dd2290",
    "#ff000090",
    "#00ccff90",
    "#ee00cc90",
    "#0000ff90", // 27 - water drops
    "#ee00cc90",
    "#ee00cc90",
    "#ee00cc90", // ID 30
    "#ee00cc90",
    "#ee00cc90",
    "#ee00cc90",
    "#ee00cc90",
    "#ee00cc90",
    "#ee00cc90",
    "#ee00cc90",
    "#ee00cc90",
    "#ee00cc90",
    // enemies ID 40+
    "#ee440090",
];

entImg = [
    // decorations ID 0-9
    new ImageObject("images/techTorch.png", vec2(160, 160)),
    new ImageObject("images/grass1.png", vec2(1280, 160)),
    undefined, // add new art here
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    // items ID 10-39
    new ImageObject("images/healthBox.png", vec2(1280, 160)),
    new ImageObject("images/redKey.png", vec2(1280, 160)),
    new ImageObject("images/greenKey.png", vec2(1280, 160)),
    new ImageObject("images/blueKey.png", vec2(1280, 160)),
    new ImageObject("images/revolverGun.png", vec2(1280, 160)),
    new ImageObject("images/revolverAmmo.png", vec2(1280, 160)),
    new ImageObject("images/winchesterGun.png", vec2(1280, 160)),
    new ImageObject("images/winchesterAmmo.png", vec2(1280, 160)),
    new ImageObject("images/barrelRed.png", vec2(160, 160)),
    new ImageObject("images/barrelSteel.png", vec2(160, 160)),
    new ImageObject("images/spikes.png", vec2(1280, 160)), // 20
    new ImageObject("images/pillar.png", vec2(1280, 160)),
    new ImageObject("images/pillarBroken.png", vec2(1280, 160)),
    new ImageObject("images/gravestone.png", vec2(1280, 160)),
    new ImageObject("images/fire.png", vec2(640, 160)),
    new ImageObject("images/coldFire.png", vec2(640, 160)),
    new ImageObject("images/mysticFire.png", vec2(640, 160)),
    new ImageObject("images/waterDrop.png", vec2(160, 160)),
    // add new art here
    undefined,
    undefined,
    undefined, // ID 30
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    // enemies ID 40+
    new ImageObject("images/fireSkullIdle.png", vec2(1280, 160)),
    undefined, // add new art here
    undefined,
    undefined, 
    // etc
];

entAttackImg = [

];

entDamageImg = [

];

entRenderOffset = [
    // decorations ID 0-9
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100),
    // items ID 10-39
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100), // ID 20
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-60),
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100), // watrdrops: y is the starting height (ceiling)
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100), // ID 30
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100),
    vec2(0,-100),
    // enemies ID 40+
    vec2(),
    // etc
];

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

        this.sprite.imageObject = entImg[this.id];
    }

    setIDProperties()
    {
        //decor are update-less entities
        if(this.id >= decorStartType + decorTotalTypes)
        {
            switch(this.id)
            {
                case ENT_HEALTHBOX:
                    this.ai = aiSpinningBobbing;
                    break;

                case ENT_REDKEY:
                    this.ai = aiSpinningBobbing;
                    break;

                case ENT_GREENKEY:
                    this.ai = aiSpinningBobbing;
                    break;

                case ENT_BLUEKEY:
                    this.ai = aiSpinningBobbing;
                    break;

                case ENT_REVOLVERGUN:
                    this.ai = aiSpinningBobbing;
                    break;

                case ENT_REVOLVERAMMO:
                    this.ai = aiSpinningBobbing;
                    break;

                case ENT_WINCHESTERGUN:
                    this.ai = aiSpinningBobbing;
                    break;

                case ENT_WINCHESTERAMMO:
                    this.ai = aiSpinningBobbing;
                    break;

                case ENT_BARREL_RED:
                    break;

                case ENT_BARREL_STEEL:
                    break;

                case ENT_SPIKES:
                    break;

                case ENT_PILLAR:
                    break;

                case ENT_PILLAR_BROKEN:
                    break;

                case ENT_GRAVESTONE:
                    break;

                case ENT_FIRE:
                    this.ai = aiSpinning;
                    break;

                case ENT_FIRE_COLD:
                    this.ai = aiSpinning;
                    break;

                case ENT_FIRE_MYSTIC:
                    this.ai = aiSpinning;
                    break;

                case ENT_WATERDROPS:
                    this.ai = aiDripping;
                    this.ai = aiSpinningBobbing; // test
                    break;

                case ENT_FIRESKULL:
                    var no = Math.random() * 4.0;
                    if(no > 3) this.ai = aiWaypointNavigation;
                    else if(no > 2) this.ai = aiAvoid;
                    else if(no > 1) this.ai = aiExplore;
                    else if(no > 0) this.ai = aiSeek;
                    break;
            }
        }
    }

    draw(renderer, plRay, circleOnly)
    {
        if (this.ai && (!mapMode || debugEntities)) this.ai(plRay);
        
        if(circleOnly)
        {
            if (!entColor[this.id]) {
                console.log("ERROR: missing entColor for sprite id " + this.id);
                return; // don't draw anything!                
            }
            
            drawCircle(renderer, this.p, entCircleDrawSize, false, entColor[this.id]);
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
            
                if (!entImg[this.id]) { // make sure we aren't missing a texture
                    // this gets galled a LOT for entities in the <10 range - maybe in old map data?    
                    if (entImg[this.id]==undefined) { // only complain once
                        // this error happens when we add a new entity ID
                        // but don't also add a LoadImage in the entImg array
                        // see top of this file
                        console.log("ERROR: missing image in entImg[] for sprite id " + this.id);
                        entImg[this.id]=false; // keep ignoring, but don't report error again
                    }                  
                    return; // don't draw anything!
                } 
                
                var imageSide = radToDeg(spriteAngle) / (360.0 /
                    (entImg[this.id].size.x / 160.0));

                this.sprite.imageObject = entImg[this.id];

                renderer.globalAlpha = round(1.0 - (dist / maxEntityVisibilityDistance), 0.2, 0);

                this.sprite.transform.scale = vec2(entScaleFactor / dist, entScaleFactor / dist);
                this.sprite.transform.position = vec2(
                    (((window.innerWidth/2) - ((this.sprite.transform.scale.x/2) * entRenderOffset[this.id].x))
                    + posRatio * (window.innerWidth/entPosSegment)) + entXOffset,
                    (window.innerHeight/2) - ((this.sprite.transform.scale.y/2) * (entRenderOffset[this.id].y * this.bobbingFactor)));
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
        newEntity.setIDProperties();

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