
class ItemManager {

    constructor()
    {
        this.ents = [];
    }

    draw(renderer, plRay, line)
    {
        for (var num=0,max=this.ents.length; num<max; num++) 
        {
            this.ents[num].addOffset(vec2(-plRay.p.x, -plRay.p.y));
            this.ents[num].draw(renderer, plRay, line);
            this.ents[num].addOffset(plRay.p);
        }
    }

    scatter(spritelist,quantity,minX,minY,maxX,maxY,offset) 
    {
        console.log("scattering " + quantity + " entities...")
        for (var num=0; num<quantity; num++) {
            var ent = new Entity();
            ent.set(
                Math.round(minX+Math.random()*(maxX-minX)),
                Math.round(minY+Math.random()*(maxY-minY)), 
                spritelist);
            if(typeof offset != "undefined") ent.renderOffset = offset
            this.ents.push(ent);
        }

    }
}

var decorations = new DecorationManager();