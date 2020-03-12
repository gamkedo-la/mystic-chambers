
class Ray
{
    constructor(vec2, angle)
    {
        this.p = vec2;
        this.angle = angle;
        this.length = 240.0;
    }

    draw(renderer, w, show)
    {
        var data = new WallData();

        var px = this.p.x;
        var py = this.p.y;
        var pdist = this.length;
        var pangle = this.angle;

        var done = false;
        var index = -1;

        for(let o = 0; o < w.length; o++)
        {
            var x1 = this.p.x;
            var y1 = this.p.y;
            var x2 = this.p.x + (this.length * Math.cos(degToRad(this.angle)));
            var y2 = this.p.y + (this.length * Math.sin(degToRad(this.angle)));

            var x3 = w[o].p1.x;
            var y3 = w[o].p1.y;
            var x4 = w[o].p2.x;
            var y4 = w[o].p2.y;

            var denominator = ((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4));

            if(denominator != 0.0)
            {
                var _px = ((((x1 * y2) - (y1 * x2)) * (x3 - x4))
				- ((x1 - x2) * ((x3 * y4) - (y3 * x4))))
				/ denominator;

                var _py = ((((x1 * y2) - (y1 * x2)) * (y3 - y4))
				- ((y1 - y2) * ((x3 * y4) - (y3 * x4))))
				/ denominator;

                var _pdist = getDistBtwVec2(vec2(x1, y1), vec2(_px, _py));

                if(isPointOnLine( vec2(x3, y3), vec2(x4, y4), vec2(_px, _py), 0.01 )
                && isPointOnLine( vec2(x1, y1), vec2(x2, y2), vec2(_px, _py), 0.01 )
                && Math.abs(_pdist) < Math.abs(pdist))
                {
                    pdist = _pdist;
                    px = _px;
                    py = _py;
                    index = o;
                }
            }
        }

        if(show)
        {
            drawLine(renderer, vec2(this.p.x, this.p.y),
                vec2(this.p.x + (pdist * Math.cos(degToRad(pangle))),
                this.p.y + (pdist * Math.sin(degToRad(pangle)))),
                "blue");
        }

        if(index > -1)
        {
            data.index = w[index].index;
            data.depth = pdist;
            data.lengthPoint = getDistBtwVec2( w[index].p1, vec2(px, py) );
            data.length = getDistBtwVec2( w[index].p1, w[index].p2 );
            data.angle = w[index].angle;
            data.type = w[index].type;
        }

        return data;
    }
};