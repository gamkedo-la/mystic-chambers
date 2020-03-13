
var maxEntityVisibilityDistance = 250.0;

var entityCollisionSize = 4.0;
var entityAfterCollisionGap = 0.25;
var entityCollisionAngleDiff = degToRad(-2.5);

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

        this.idleImages = [];
        this.walkImages = [];
        this.attackImages = [];
        this.damageImages = [];
        this.deathImages = [];
    }

    set(x, y, idleImages, walkImages, attackImages, damageImages, deathImages)
    {
        this.p.x = x;
        this.p.y = y;

        this.idleImages = typeof idleImages == "undefined" ? [] : idleImages;
        this.walkImages = typeof walkImages == "undefined" ? [] : walkImages;
        this.attackImages = typeof attackImages == "undefined" ? [] : attackImages;
        this.damageImages = typeof damageImages == "undefined" ? [] : damageImages;
        this.deathImages = typeof deathImages == "undefined" ? [] : deathImages;

        this.sprite.imageObject = idleImages[0];
    }

    draw(renderer, plRay, line)
    {
        if(line)
        {
            var plPosT = vec2(window.innerWidth/2, window.innerHeight/2);
            drawLine(renderer,
                vec2(this.p.x - (Math.cos(degToRad(this.angle)) * this.size),
                this.p.y - (Math.sin(degToRad(this.angle)) * this.size)),
                vec2(this.p.x + (Math.cos(degToRad(this.angle)) * this.size),
                this.p.y + (Math.sin(degToRad(this.angle)) * this.size)), "white");

            drawCircle(renderer, this.p, entityCollisionSize, false, "white");
        }
        else
        {
            var dist = plRay.p.distance(this.p);

            //if(dist < maxEntityVisibilityDistance)
            {
                var posRatio = radToDeg(plRay.p.angle(this.p) + (Math.PI/2.0))
                    - (plRay.angle + 270.0);
                var posSegment = 30.0;
                var scaleFactor = 50.0;

                var imageSide = radToDeg(plRay.p.angle(this.p) + Math.PI)
                    / (360.0 / this.idleImages.length);
                this.sprite.imageObject = this.idleImages[Math.floor(imageSide)];

                this.sprite.transform.scale = vec2(scaleFactor / dist, scaleFactor / dist);
                this.sprite.transform.position = vec2(
                    ((window.innerWidth/2) - ((this.sprite.transform.scale.x/2) * this.renderOffset.x))
                    + posRatio * (window.innerWidth/posSegment),
                    (window.innerHeight/2) - ((this.sprite.transform.scale.y/2) * this.renderOffset.y));
                this.sprite.drawSc();
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
        if(line) { entities[num].addOffset(vec2(-plRay.p.x, -plRay.p.y)); }
        entities[num].draw(renderer, plRay, line);
        if(line) { entities[num].addOffset(plRay.p); }
    }
}