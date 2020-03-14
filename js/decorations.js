// designed for non-interactive props - they never update
// such as grass, greebles, rocks, debris, cracks, crates

class DecorationManager {

    constructor()
    {
        this.ents = [];
    }

    scatter(id, quantity, minX, minY, maxX, maxY, offset)
    {
        console.log("scattering " + quantity + " entities...")

        for (var num=0; num<quantity; num++)
        {
            var ent = new Entity();
            ent.set(
                Math.round(minX+Math.random()*(maxX-minX)),
                Math.round(minY+Math.random()*(maxY-minY)), 
                id);
            if(typeof offset != "undefined") ent.renderOffset = offset;

            this.ents.push(ent);
            entities.push(ent);
        }

    }
}

var decorations = new DecorationManager();