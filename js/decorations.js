// designed for non-interactive props - they never update
// such as grass, greebles, rocks, debris, cracks, crates

class DecorationManager {

    constructor()
    {
        this.ents = [];
    }

    draw(renderer, plRay, line)
    {
        //console.log("Drawing decorations");
        for (var num=0,max=this.ents.length; num<max; num++) 
        {
            this.ents[num].draw(renderer, plRay, line);
        }
    }

    scatter(spritelist,quantity,minX,minY,maxX,maxY) 
    {
        console.log("scattering " + quantity + " entities...")
        for (var num=0; num<quantity; num++) {
            var ent = new Entity();
            ent.set(
                Math.round(minX+Math.random()*(maxX-minX)),
                Math.round(minY+Math.random()*(maxY-minY)), 
                spritelist);
            
            this.ents.push(ent);
        }

    }
}

var decorations = new DecorationManager();