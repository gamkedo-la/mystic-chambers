
class ItemManager {

    constructor()
    {
        this.ents = [];
    }

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

                    case ENT_REDKEY:
                        break;

                    case ENT_GREENKEY:
                        break;

                    case ENT_BLUEKEY:
                        break;

                    case ENT_REVOLVERGUN:
                        availableGuns[GUN_REVOLVER] = true;
                        currentGun = GUN_REVOLVER;
                        totalAmmo[GUN_REVOLVER] += ammoItemIncrement[GUN_REVOLVER];
                        ammoInGun[GUN_REVOLVER] = gunAmmoCapacity[GUN_REVOLVER];
                        break;

                    case ENT_REVOLVERAMMO:
                        totalAmmo[GUN_REVOLVER] += ammoItemIncrement[GUN_REVOLVER];
                        break;

                    case ENT_WINCHESTERGUN:
                        availableGuns[GUN_WINCHESTER] = true;
                        currentGun = GUN_WINCHESTER;
                        totalAmmo[GUN_WINCHESTER] += ammoItemIncrement[GUN_REVOLVER];
                        ammoInGun[GUN_WINCHESTER] = gunAmmoCapacity[GUN_WINCHESTER];
                        break;

                    case ENT_WINCHESTERAMMO:
                        totalAmmo[GUN_WINCHESTER] += ammoItemIncrement[GUN_WINCHESTER];
                        break;

                    default:
                        //do nothing
                }

                removeEntityInSector(this.ents[i]);
                removeEntity(this.ents[i]);
                this.ents.splice(i, 1);
            }
        }
    }
}

var items = new ItemManager();