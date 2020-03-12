
class Entity
{
    constructor()
    {
        this.p = vec2(0.0, 0.0);
        this.size = 4.0;
        this.angle = 0.0;
    }

    set(x, y)
    {
        this.p.x = x;
        this.p.y = y;
    }

    draw(renderer, playerPos)
    {
        this.angle = playerPos.angle(this.p) + (Math.PI/2.0);
        drawLine(renderer,
            vec2(this.p.x - (Math.cos(this.angle) * this.size),
            this.p.y - (Math.sin(this.angle) * this.size)),
            vec2(this.p.x + (Math.cos(this.angle) * this.size),
            this.p.y + (Math.sin(this.angle) * this.size)), "white");
    }

    addOffset(vec2)
    {
        this.p.x += vec2.x;
        this.p.y += vec2.y;
    }
}