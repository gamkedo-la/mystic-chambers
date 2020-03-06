
var areaPadding = 3.0;

class Area
{
    constructor(pos, size, type)
    {
        this.pos = pos;
        this.size = size;
        this.type = type;
    }

    draw(renderer, typeColors)
    {
        drawRect(renderer, this.pos, this.size, true,
            typeof typeColors == "undefined" ? "white" : typeColors[this.type]);
    }

    getPaddedPos()
    {
        return vec2(this.pos.x - areaPadding, this.pos.y - areaPadding);
    }

    getPaddedSize()
    {
        return vec2(this.size.x + (areaPadding*2), this.size.y + (areaPadding*2));
    }

    relPointBounds(p)
    {
        var rel = vec2(p.x - this.getPaddedPos().x, p.y - this.getPaddedPos().y);

        if(rel.x > 0 && rel.x < this.getPaddedSize().x
            && rel.y > 0 && rel.y < this.getPaddedSize().y) return rel;
        else return vec2(0, 0);
    }

    isPointInside(p)
    {
        var rel = this.relPointBounds(p);
        return !(rel.x == 0 && rel.y == 0);
    }

    getCollValue(p, prevP)
    {
        var rel = this.relPointBounds(p);

        if(rel.x == 0 && rel.y == 0) return vec2();

        var toLeft = rel.x;
        var toRight = this.getPaddedSize().x - rel.x;
        var toUp = rel.y;
        var toDown = this.getPaddedSize().y - rel.y;

        var collValue = vec2(0,0);

        if(toLeft < toRight) collValue.x = -toLeft;
        else if(toLeft > toRight) collValue.x = toRight;
        else if(prevP.x < p.x) collValue.x = -toLeft;
        else if(prevP.x > p.x) collValue.x = toRight;

        if(toUp < toDown) collValue.y = -toUp;
        else if(toUp > toDown) collValue.y = toDown;
        else if(prevP.y < p.y) collValue.y = -toUp;
        else if(prevP.y > p.y) collValue.y = toDown;

        if(Math.abs(collValue.x) < Math.abs(collValue.y)) collValue.y = 0;
        else if(Math.abs(collValue.y) < Math.abs(collValue.x)) collValue.x = 0;

        return collValue;
    }

    addOffset(vec2)
    {
        this.pos.x += vec2.x;
        this.pos.y += vec2.y;
    }

    calcSize(_vec2)
    {
        return vec2(-this.pos.x + _vec2.x, -this.pos.y + _vec2.y);
    }

    toString()
    {
        return Math.floor(this.pos.x.toString()) + " " + Math.floor(this.pos.y.toString()) + " " +
            Math.floor(this.size.x.toString()) + " " + Math.floor(this.size.y.toString()) + " " +
            Math.floor(this.type.toString()) + " ";
    }
}

function convertAreasToString(areas)
{
    var str = "";
    for(let i = 0; i < areas.length; i++) str += areas[i].toString();
    str += ".";
    return str;
}

function generateAreasFromString(areas, str)
{
    var values = str.split(' ');
    for(let i = 0; i < values.length; i+=5)
    {
        areas.push(new Area(vec2(parseInt(values[i]), parseInt(values[i+1])),
            vec2(parseInt(values[i+2]), parseInt(values[i+3])), parseInt(values[i+4])));
    }
}