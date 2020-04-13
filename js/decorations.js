// designed for non-interactive props - they never update
// such as grass, greebles, rocks, debris, cracks, crates

class DecorationManager {

    constructor()
    {
        this.ents = [];
    }

    add(x, y, id)
    {
        var ent = new Entity();
        ent.set(x,y,id);
        ent.setIDProperties();
        this.ents.push(ent);
        entities.push(ent);
    }

    scatter(id, quantity, minX, minY, maxX, maxY, offset)
    {
        console.log("scattering " + quantity + " entities with ID " + id);
        for (var num=0; num<quantity; num++)
        {
            var ent = new Entity();
            ent.set(
                Math.round(minX+Math.random()*(maxX-minX)),
                Math.round(minY+Math.random()*(maxY-minY)), 
                id);
            if(typeof offset != "undefined") ent.renderOffset = offset;

            
            ent.setIDProperties(); // update!

            this.ents.push(ent);
            entities.push(ent);
        }
    }

    removeIfNotInEntities()
    {
        for (let d = 0; d < this.ents.length; d++)
        {
            var isInEntities = false;
            for (let i = 0; i < entities.length; i++)
            {
                if(entities[i] == this.ents[d])
                {
                    isInEntities = true;
                    break;
                }
            }

            if(!isInEntities)
            {
                this.ents.splice(d, 1);
                d--;
            }
        }
    }
}

var decor = new DecorationManager();