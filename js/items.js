
class ItemManager {

    constructor()
    {
        this.ents = [];
    }

    /*draw(renderer, plRay, line)
    {
        for (var num=0,max=this.ents.length; num<max; num++) 
        {
            this.ents[num].addOffset(vec2(-plRay.p.x, -plRay.p.y));
            this.ents[num].draw(renderer, plRay, line);
            this.ents[num].addOffset(plRay.p);
        }
    }*/

    add(x, y, id, offset)
    {
        var ent = new Entity();
        ent.set(x, y, id);
        if(typeof offset != "undefined") ent.renderOffset = offset;

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
                    case ENT_HEALTHBOX:
                        playerHealth += 25;
                        if(playerHealth > playerMaxHealth)
                            playerHealth = playerMaxHealth;
                        break;

                    case 283 /* ENT_SOME_OTHER_ITEM */:
                        //...
                        break;

                    default:
                        //do nothing
                }

                removeEntity(this.ents[i]);
                this.ents.splice(i, 1);
            }
        }
    }
}

var items = new ItemManager();