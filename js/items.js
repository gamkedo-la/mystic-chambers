
var itemPickupFlashFrames = 5;
var itemPickupFlash = 0;
var itemPickupFlashColor = "#FFFFFF15";

class ItemManager {

    constructor()
    {
        this.ents = [];
    }

    add(x, y, id)
    {
        var ent = new Entity();
        ent.set(x, y, id);
        ent.setIDProperties();
        this.ents.push(ent);
        entities.push(ent);
    }

    check(pos)
    {
        for(let i = 0; i < this.ents.length; i++)
        {
            var coll = this.ents[i].getCollValue(pos);
            if(coll.x != 0.0 && coll.y != 0.0)
            {
                var shouldDestroy = true;
                switch(this.ents[i].id)
                {
                    case ENT_HEALTHBOX:
                        playerHealth += 25;
                        if(playerHealth > playerMaxHealth)
                            playerHealth = playerMaxHealth;
                        subtitleManager.updateAndDisplayText("PICKED HEALTH PACK");
                        break;

                    case ENT_REDKEY:
                        availableKeys[KEY_RED] = true;
                        subtitleManager.updateAndDisplayText("PICKED RED KEY");
                        break;

                    case ENT_GREENKEY:
                        availableKeys[KEY_GREEN] = true;
                        subtitleManager.updateAndDisplayText("PICKED GREEN KEY");
                        break;

                    case ENT_BLUEKEY:
                        availableKeys[KEY_BLUE] = true;
                        subtitleManager.updateAndDisplayText("PICKED BLUE KEY");
                        break;

                    case ENT_REVOLVERGUN:
                        availableGuns[GUN_REVOLVER] = true;
                        changeGun(GUN_REVOLVER);
                        totalAmmo[GUN_REVOLVER] += ammoItemIncrement[GUN_REVOLVER];
                        ammoInGun[GUN_REVOLVER] = gunAmmoCapacity[GUN_REVOLVER];
                        subtitleManager.updateAndDisplayText("PICKED REVOLVER GUN");
                        break;

                    case ENT_REVOLVERAMMO:
                        totalAmmo[GUN_REVOLVER] += ammoItemIncrement[GUN_REVOLVER];
                        subtitleManager.updateAndDisplayText("PICKED REVOLVER AMMO");
                        break;

                    case ENT_WINCHESTERGUN:
                        availableGuns[GUN_WINCHESTER] = true;
                        changeGun(GUN_WINCHESTER);
                        totalAmmo[GUN_WINCHESTER] += ammoItemIncrement[GUN_REVOLVER];
                        ammoInGun[GUN_WINCHESTER] = gunAmmoCapacity[GUN_WINCHESTER];
                        subtitleManager.updateAndDisplayText("PICKED WINCHESTER GUN");
                        break;

                    case ENT_WINCHESTERAMMO:
                        totalAmmo[GUN_WINCHESTER] += ammoItemIncrement[GUN_WINCHESTER];
                        subtitleManager.updateAndDisplayText("PICKED WINCHESTER AMMO");
                        break;

                    case ENT_BARREL_STEEL:
                        plPos = prevPlPos;
                        this.ents[i].p.x += Math.cos(degToRad(ray[ray.length/2].angle))/2.0;
                        this.ents[i].p.y += Math.sin(degToRad(ray[ray.length/2].angle))/2.0;
                        // FIXME play metal clang sound, but otherwise do nothing
                        // console.log("steel barrel hit!");
                        shouldDestroy = false;
                        break;

                    case ENT_BARREL_RED:
                        plPos = prevPlPos;
                        this.ents[i].p.x += Math.cos(degToRad(ray[ray.length/2].angle))/2.0;
                        this.ents[i].p.y += Math.sin(degToRad(ray[ray.length/2].angle))/2.0;
                        // FIXME explode!
                        // console.log("red barrel hit!");
                        shouldDestroy = false; // TODO: BOOM!!!!
                        break;

                    case ENT_SPIKES:
                        playerHealth -= 1;
                        shouldDestroy = false;
                        break;

                    case ENT_PILLAR:
                        plPos = prevPlPos;
                        shouldDestroy = false;
                        break;

                    case ENT_PILLAR_BROKEN:
                        plPos = prevPlPos;
                        shouldDestroy = false;
                        break;

                    case ENT_GRAVESTONE:
                        plPos = prevPlPos;
                        shouldDestroy = false;
                        break;

                    case ENT_FIRE:
                        playerHealth -= 1;
                        shouldDestroy = false;
                        break;
    
                    case ENT_FIRE_COLD:
                        playerHealth -= 1;
                        shouldDestroy = false;
                        break;
    
                    case ENT_FIRE_MYSTIC:
                        playerHealth -= 1;
                        shouldDestroy = false;
                        break;

                    default:
                        //do nothing
                }

                if (shouldDestroy)
                {
                    removeEntityInSector(this.ents[i]);
                    removeEntity(this.ents[i]);
                    this.ents.splice(i, 1);
                    i--;

                    itemPickupFlash += itemPickupFlashFrames;
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

var items = new ItemManager();