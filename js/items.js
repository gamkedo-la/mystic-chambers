class ItemManager
{
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
                        audio.play1DSound(sounds[ITEM_PICKUP]);
                        subtitleManager.updateAndDisplayText("PICKED HEALTH PACK");
                        break;

                    case ENT_REDKEY:
                        availableKeys[KEY_RED] = true;
                        audio.play1DSound(sounds[ITEM_PICKUP]);
                        subtitleManager.updateAndDisplayText("PICKED RED KEY");
                        break;

                    case ENT_GREENKEY:
                        availableKeys[KEY_GREEN] = true;
                        audio.play1DSound(sounds[ITEM_PICKUP]);
                        subtitleManager.updateAndDisplayText("PICKED GREEN KEY");
                        break;

                    case ENT_BLUEKEY:
                        availableKeys[KEY_BLUE] = true;
                        audio.play1DSound(sounds[ITEM_PICKUP]);
                        subtitleManager.updateAndDisplayText("PICKED BLUE KEY");
                        break;

                    case ENT_REVOLVERGUN:
                        availableGuns[GUN_REVOLVER] = true;
                        changeGun(GUN_REVOLVER);
                        totalAmmo[GUN_REVOLVER] += ammoItemIncrement[GUN_REVOLVER];
                        ammoInGun[GUN_REVOLVER] = gunAmmoCapacity[GUN_REVOLVER];
                        audio.play1DSound(sounds[ITEM_PICKUP]);
                        subtitleManager.updateAndDisplayText("PICKED REVOLVER GUN");
                        break;

                    case ENT_REVOLVERAMMO:
                        totalAmmo[GUN_REVOLVER] += ammoItemIncrement[GUN_REVOLVER];
                        audio.play1DSound(sounds[TAKE_AMMO]);
                        subtitleManager.updateAndDisplayText("PICKED REVOLVER AMMO");
                        break;

                    case ENT_WINCHESTERGUN:
                        availableGuns[GUN_WINCHESTER] = true;
                        changeGun(GUN_WINCHESTER);
                        totalAmmo[GUN_WINCHESTER] += ammoItemIncrement[GUN_REVOLVER];
                        ammoInGun[GUN_WINCHESTER] = gunAmmoCapacity[GUN_WINCHESTER];
                        audio.play1DSound(sounds[ITEM_PICKUP]);
                        subtitleManager.updateAndDisplayText("PICKED WINCHESTER GUN");
                        break;

                    case ENT_WINCHESTERAMMO:
                        totalAmmo[GUN_WINCHESTER] += ammoItemIncrement[GUN_WINCHESTER];
                        audio.play1DSound(sounds[TAKE_AMMO]);
                        subtitleManager.updateAndDisplayText("PICKED WINCHESTER AMMO");
                        break;

                    case ENT_BARREL_STEEL:
                        plPos = prevPlPos;
                        /*this.ents[i].p.x += Math.cos(degToRad(ray[ray.length/2].angle))/2.0;
                        this.ents[i].p.y += Math.sin(degToRad(ray[ray.length/2].angle))/2.0;*/
                        
                        // FIXME play metal clang sound, but otherwise do nothing
                        // console.log("steel barrel hit!");

                        shouldDestroy = false;
                        break;

                    case ENT_BARREL_RED:
                        plPos = prevPlPos;
                        /*this.ents[i].p.x += Math.cos(degToRad(ray[ray.length/2].angle))/2.0;
                        this.ents[i].p.y += Math.sin(degToRad(ray[ray.length/2].angle))/2.0;*/
                        
                        // FIXME explode!
                        // console.log("red barrel hit!");

                        shouldDestroy = false; // TODO: BOOM!!!!

                        break;

                    case ENT_SPIKES:
                        playerHealth -= 1;
                        flash = flashTime;
                        flashColor = playerDamageFlashColor;
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
                        flash = flashTime;
                        flashColor = playerDamageFlashColor;
                        shouldDestroy = false;
                        break;
    
                    case ENT_FIRE_COLD:
                        playerHealth -= 1;
                        flash = flashTime;
                        flashColor = playerDamageFlashColor;
                        shouldDestroy = false;
                        break;
    
                    case ENT_FIRE_MYSTIC:
                        playerHealth -= 1;
                        flash = flashTime;
                        flashColor = playerDamageFlashColor;
                        shouldDestroy = false;
                        break;

                    case ENT_WATERDROPS:
                        shouldDestroy = false;
                        break;

                    case ENT_PEARL:
                        //WIP!!!
                        break;

                    case ENT_PORTAL:
                        shouldDestroy = false;
                        flash = flashTime;
                        flashColor = portalFlashColor;
                        plPos = vec2(this.ents[i].connectionPortal.p.x + (Math.cos(degToRad(ray[ray.length/2].angle)) * portalSpawnDistance),
                            this.ents[i].connectionPortal.p.y + (Math.sin(degToRad(ray[ray.length/2].angle)) * portalSpawnDistance));
                        activeSector = this.ents[i].connectionPortal.sector;
                        audio.play1DSound(sounds[PORTAL_TRAVEL]);
                        subtitleManager.updateAndDisplayText("ENTERED THE PORTAL!");
                        break;

                    case ENT_CRACK:
                        shouldDestroy = false;
                        break;

                    case ENT_LADDER:
                        //go to next level...
                        while(wall.length > 0) { deleteWallFromAllSectors(wall[wall.length - 1]); wall.pop(); }
                        while(area.length > 0) area.pop();
                        while(entities.length > 0) { entities.pop(); decor.removeIfNotInEntities(); items.removeIfNotInEntities(); enemies.removeIfNotInEntities(); }
                        activeSector = undefined;
                        currentLevel++;
                        loadLevel(wall, area);
                        lvLabel.text = getLevelName();
                        flash = flashTime*3;
                        flashColor = levelCompleteFlashColor;
                        audio.play1DSound(sounds[INCEPTION]);
                        subtitleManager.updateAndDisplayText("LEVEL COMPLETE!");

                        ui.stateIndex = NEXTLEVELUI;
                        flexibleLabel.text = "LEVEL " + (currentLevel-1).toString() + " COMPLETED!";
                        flexibleLabel.textColor = "#44FF44";
                        timeTakenLabel.text = "TIME TAKEN: " + (gameTimer/1000.0).toString() + " SECONDS";
                        enemiesKilledLabel.text = "ENEMIES KILLED: " + enemiesKilled.toString();
                        ui.transitionAnimation();
                        break;

                    case ENT_TREASURE:
                        //go to next level...
                        while(wall.length > 0) { deleteWallFromAllSectors(wall[wall.length - 1]); wall.pop(); }
                        while(area.length > 0) area.pop();
                        while(entities.length > 0) { entities.pop(); decor.removeIfNotInEntities(); items.removeIfNotInEntities(); enemies.removeIfNotInEntities(); }
                        activeSector = undefined;
                        currentLevel++;
                        flash = flashTime*3;
                        flashColor = levelCompleteFlashColor;
                        audio.play1DSound(sounds[INCEPTION]);
                        subtitleManager.updateAndDisplayText("GAME FINISH!");

                        ui.stateIndex = NEXTLEVELUI;
                        flexibleLabel.text = "YOU FOUND THE MYSTUS TREASURE!";
                        flexibleLabel.textColor = "#FFFF44";
                        timeTakenLabel.text = "TIME TAKEN: " + (gameTimer/1000.0).toString() + " SECONDS";
                        enemiesKilledLabel.text = "ENEMIES KILLED: " + enemiesKilled.toString();
                        ui.transitionAnimation();
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

                    flash = flashTime;
                    flashColor = itemPickupFlashColor;
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

function itemToPlayerShotReaction(item) //return true to destroy item
{
    switch(item.id)
    {
        case ENT_PILLAR:
            if(typeof item.hp == "undefined") { item.hp = 1; }
            else if(item.hp > 0) { item.hp--; }
            else { item.id = ENT_PILLAR_BROKEN;
                item.setIDProperties(); }

            if(Math.random() < 0.5) audio.play3DSound(sounds[WALL1], item.p, rndAP(), rndAP());
            else { if(Math.random() < 0.5) audio.play3DSound(sounds[WALL2], item.p, rndAP(), rndAP());
            else audio.play3DSound(sounds[WALL3], item.p, rndAP(), rndAP()); }

            if(Math.random() < 0.5) decor.addUsingAnotherEntity(item, ENT_EFFECT2);
            else decor.addUsingAnotherEntity(item, ENT_EFFECT3);
            break;

        case ENT_SPIKES:

            if(typeof item.hp == "undefined") { item.hp = 1; }
            else if(item.hp > 0) { item.hp--; }
            else { decor.addUsingAnotherEntity(item, ENT_DESTROY1); return true; }

            //WIP!!!
            //Play sound!!!

            if(Math.random() < 0.5) decor.addUsingAnotherEntity(item, ENT_EFFECT2);
            else decor.addUsingAnotherEntity(item, ENT_EFFECT3);
            break;

        case ENT_BARREL_STEEL:

            item.p.x += Math.cos(degToRad(ray[ray.length/2].angle))*4.0;
            item.p.y += Math.sin(degToRad(ray[ray.length/2].angle))*4.0;

            /*if(typeof item.hp == "undefined") { item.hp = 1; }
            else if(item.hp > 0) {item.hp--; }
            else { decor.addUsingAnotherEntity(item, ENT_DESTROY1); return true; }*/

            audio.play1DSound(sounds[SFX_BARREL_HIT]);

            if(Math.random() < 0.5) decor.addUsingAnotherEntity(item, ENT_EFFECT2);
            else decor.addUsingAnotherEntity(item, ENT_EFFECT3);
            break;

        case ENT_BARREL_RED:

            item.p.x += Math.cos(degToRad(ray[ray.length/2].angle))*4.0;
            item.p.y += Math.sin(degToRad(ray[ray.length/2].angle))*4.0;

            if(typeof item.hp == "undefined")
            {
                item.hp = 1;
            }
            else if(item.hp > 0)
            { 
                item.hp--; 
                audio.play1DSound(sounds[SFX_BARREL_HIT]);
            }
            else
            { 
                audio.play1DSound(sounds[SFX_BARREL_EXPLODE]);
                decor.addUsingAnotherEntity(item, ENT_DESTROY2); return true; 
            }

            if(Math.random() < 0.5) decor.addUsingAnotherEntity(item, ENT_EFFECT2);
            else decor.addUsingAnotherEntity(item, ENT_EFFECT3);
            break;

        case ENT_CRACK:
            if(typeof item.hp == "undefined") { item.hp = 3; }
            else if(item.hp > 0) { item.hp--; }
            else { decor.addUsingAnotherEntity(item, ENT_DESTROY1);
                wall[item.connectionWall.index].p2.x = wall[item.connectionWall.index].p1.x;
                wall[item.connectionWall.index].p2.y = wall[item.connectionWall.index].p1.y;
                audio.play3DSound(sounds[WALL3], item.p, rndAP(), rndAP());
                audio.play3DSound(sounds[WALL3], item.p, rndAP(), rndAP());
                flash = flashTime;
                flashColor = wallCrackFlashColor;
                subtitleManager.updateAndDisplayText("HIDDEN PATH DISCOVERED!"); return true; }

            if(Math.random() < 0.5) audio.play3DSound(sounds[WALL1], item.p, rndAP(), rndAP());
            else { if(Math.random() < 0.5) audio.play3DSound(sounds[WALL2], item.p, rndAP(), rndAP());
            else audio.play3DSound(sounds[WALL3], item.p, rndAP(), rndAP()); }

            if(Math.random() < 0.5) decor.addUsingAnotherEntity(item, ENT_EFFECT2);
            else decor.addUsingAnotherEntity(item, ENT_EFFECT3);
            break;

        default:
            //NOTHING!
            /*if(Math.random() < 0.5) audio.play3DSound(sounds[WALL1], item.p, rndAP(), rndAP());
            else { if(Math.random() < 0.5) audio.play3DSound(sounds[WALL2], item.p, rndAP(), rndAP());
            else audio.play3DSound(sounds[WALL3], item.p, rndAP(), rndAP()); }

            if(Math.random() < 0.5) decor.addUsingAnotherEntity(item, ENT_EFFECT2);
            else decor.addUsingAnotherEntity(item, ENT_EFFECT3);*/
    }

    return false;
}