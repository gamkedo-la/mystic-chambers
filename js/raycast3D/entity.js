
//Requires Sprite
class Entity
{
    constructor()
    {
        this.p = vec2(0.0, 0.0);
        this.size = 4.0;
        this.angle = 0.0;
        this.sprite = undefined;
    }

    set(x, y, sprite)
    {
        this.p.x = x;
        this.p.y = y;
        this.sprite = sprite;
    }

    draw(renderer, plRay, line)
    {
        if(line)
        {
            var plPosT = vec2(window.innerWidth/2, window.innerHeight/2);
            this.angle = plPosT.angle(this.p) + (Math.PI/2.0);
            drawLine(renderer,
                vec2(this.p.x - (Math.cos(this.angle) * this.size),
                this.p.y - (Math.sin(this.angle) * this.size)),
                vec2(this.p.x + (Math.cos(this.angle) * this.size),
                this.p.y + (Math.sin(this.angle) * this.size)), "white");
        }
        else
        {
            this.angle = plRay.p.angle(this.p) + (Math.PI/2.0);
            var dist = plRay.p.distance(this.p);

            var posRatio = radToDeg(this.angle) - (plRay.angle + 270.0);
            var posSegment = 30.0;
            var scaleFactor = 30.0;

            this.sprite.transform.scale = vec2(scaleFactor / dist, scaleFactor / dist);
            this.sprite.transform.position = vec2(
                ((window.innerWidth/2) - (this.sprite.transform.scale.x/2))
                + posRatio * (window.innerWidth/posSegment),
                (window.innerHeight/2) - (this.sprite.transform.scale.y/2));
            this.sprite.drawSc();
        }
    }

    addOffset(vec2)
    {
        this.p.x += vec2.x;
        this.p.y += vec2.y;
    }
}