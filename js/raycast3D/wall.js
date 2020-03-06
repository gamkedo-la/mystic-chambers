
totalWalls = 0;
class Wall
{
    constructor()
    {
        this.p1 = vec2(0, 0);
        this.p2 = vec2(0, 0);
        this.angle = 0;
        this.type = 0;

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
            "#333333");
		}
    }

    addOffset(vec2)
    {
        this.p1.x += vec2.x;
        this.p1.y += vec2.y;
        this.p2.x += vec2.x;
        this.p2.y += vec2.y;
    }

    toString()
    {
        return Math.floor(this.p1.x.toString()) + " " + Math.floor(this.p1.y.toString()) + " " +
            Math.floor(this.p2.x.toString()) + " " + Math.floor(this.p2.y.toString()) + " " +
            Math.floor(this.type.toString()) + " ";
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
    }
};

function generateRandomWalls(walls, totalWalls, wallImages)
{
    for (let i = 0; i < totalWalls; i++) walls.push(new Wall());

    for (let i = 0; i < totalWalls; i++)
    {
        if (Math.random() < 0.5)
        {
            walls[i].p1.x = Math.random() * window.innerWidth;
            walls[i].p1.y = Math.random() * window.innerHeight;
            walls[i].p2.x = walls[i].p1.x;
            walls[i].p2.y = Math.random() * window.innerHeight;
        }
        else
        {
            walls[i].p1.x = Math.random() * window.innerWidth;
            walls[i].p1.y = Math.random() * window.innerHeight;
            walls[i].p2.x = Math.random() * window.innerWidth;
            walls[i].p2.y = walls[i].p1.y;
        }
        walls[i].angle = walls[i].p1.angle(walls[i].p2);
        walls[i].type = i % wallImages.length;
    }
}

function convertWallsToString(walls)
{
    var str = "";
    for(let i = 0; i < walls.length; i++) str += walls[i].toString();
    str += ".";
    return str;
}

function generateWallsFromString(walls, str)
{
    var values = str.split(' ');
    for(let i = 0; i < values.length; i+=5)
    {
        var newWall = new Wall();
        newWall.set(parseInt(values[i]), parseInt(values[i+1]), parseInt(values[i+2]), parseInt(values[i+3]));
        newWall.type = parseInt(values[i+4]);
        walls.push(newWall);
    }
}