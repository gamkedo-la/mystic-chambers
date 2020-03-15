
var entPosSegment = 45.0;
var entScaleFactor = 40.0;
var entAngleOffset = 270.0;
var entXOffset = 0.0;
var entMinRenderAngle = 155.0;
var entMaxRenderAngle = 205.0;

var maxEntityVisibilityDistance = 250.0;

var entityCollisionSize = 4.0;
var entityAfterCollisionGap = 0.25;
var entityCollisionAngleDiff = degToRad(-2.5);

//Entity IDs
const ENT_TECHTORCH = 0;
const ENT_HEALTHBOX = 1;
const ENT_FIRESKULL_NEW = 2;
const ENT_FIRESKULL_OLD = 3;

entImg = [
    //DECOR IMAGES START
        new ImageObject("images/tech_torch_x10.png", vec2(160, 160)),
    //DECOR IMAGES END

    //ITEM IMAGES START
        new ImageObject("images/healthBox.png", vec2(1280, 160)),
    //ITEM IMAGES END

    //ENEMY IMAGES START
        new ImageObject("images/fireSkullIdle.png", vec2(1280, 160)),
        new ImageObject("images/fireSkullOldIdle.png", vec2(1280, 160)),
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
            //var plPosT = vec2(window.innerWidth/2, window.innerHeight/2);
            drawLine(renderer,
                vec2(this.p.x - (Math.cos(degToRad(this.angle)) * this.size),
                this.p.y - (Math.sin(degToRad(this.angle)) * this.size)),
                vec2(this.p.x + (Math.cos(degToRad(this.angle)) * this.size),
                this.p.y + (Math.sin(degToRad(this.angle)) * this.size)), "white");

            drawCircle(renderer, this.p, entityCollisionSize, false, "white");
        }
        else
        {
            var plRayAngle = plRay.angle;

            //if(Math.random() < 0.1) console.log(plRayAngle);

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
                this.sprite.drawScIn(vec2(Math.floor(imageSide) * 160, 0), vec2(160, 160));

                renderer.globalAlpha = 1.0;

                /*
                renderer.globalCompositeOperation = "source-atop";
                var computedSize = vec2(160, 160).multiply(this.sprite.transform.scale)
                drawRect(renderer, this.sprite.transform.position.subtract(vec2(computedSize.x/2, computedSize.y/2)),
                    computedSize,
                    true, "#FFFFFFFF");
                renderer.globalCompositeOperation = "source-over";
                */
            }
        }
    }

    getCollValue(plP)
    {
        var dist = plP.distance(this.p);

        if(dist < entityCollisionSize)
        {
            return vec2((entityCollisionSize + entityAfterCollisionGap - dist) * Math.cos(this.angle + entityCollisionAngleDiff),
                (entityCollisionSize + entityAfterCollisionGap - dist) * Math.sin(this.angle + entityCollisionAngleDiff));
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
    for (var num = 0, max = this.entities.length; num < max; num++) 
    {
        if(line) entities[num].addOffset(vec2(-plRay.p.x + (window.innerWidth/2), -plRay.p.y + (window.innerHeight/2)));
        entities[num].draw(renderer, plRay, line);
        if(line) entities[num].addOffset(vec2(plRay.p.x - (window.innerWidth/2), plRay.p.y - (window.innerHeight/2)));
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