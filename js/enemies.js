
class EnemyManager {

    constructor()
    {
        this.ents = [];
    }

    add(x, y, id, name, ai, offset)
    {
        var ent = new Entity();
        ent.set(x, y, id);
        if(typeof offset != "undefined") ent.renderOffset = offset;
        ent.name = name;
        ent.ai = ai;

        this.ents.push(ent);
        entities.push(ent);
    }

    check(plPos)
    {
        for(let i = 0; i < this.ents.length; i++)
        {
            var coll = this.ents[i].getCollValue(plPos);
            if(coll.x != 0.0 && coll.y != 0.0)
            {
                switch(this.ents[i].id)
                {
                    case ENT_FIRESKULL:
                        playerHealth -= 1;
                        break;

                    default:
                        //do nothing
                }
            }
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

var enemies = new EnemyManager();