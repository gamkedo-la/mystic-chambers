const GUN_REVOLVER = 0;
const GUN_WINCHESTER = 1;

var totalGuns = 2;
var availableGuns = [false, false];
var totalAmmo = [0, 0];
var ammoInGun = [0, 0];
var gunAmmoCapacity = [6, 12];
var ammoItemIncrement = [24, 12];
var currentGun = -1;
var gunSwitchKeyPress = "q";
var gunReloadKeyPress = "r";
var gunShootKeyPress = "e";

var previousGun = -1;
var gunTransition = 0;
var gunYPos = 0;
var gunTransitionLerpFactor = 0.0125;
var gunTransitionSnap = 10;

var gunsDisplayUI = new Sprite(tr(vec2(), vec2(0.5, 0.5)), undefined);
var gunDisplayUIOffset = vec2(60.0, 40.0);
var gunDisplayXIncrement = 120.0;
var gunDisplayInactiveAlpha = 0.25;
var gunDisplayTextOffset = vec2(-20.0, 60.0);
var gunDisplayTextSize = 0.03;

var gunMaxY = screen.height + 240;
var gunDefMinY = screen.height - 240;

var playerShotAccuracyFactor = 75;

var gunImages = [
    new ImageObject("images/revolver.png", vec2(2880, 480)),
    new ImageObject("images/winchester.png", vec2(2880, 480)),
];
var currentGunFrame = 0;
var gun = new Sprite(tr(vec2(screen.width/2, 0)), undefined);
var gunBobbingCounter = 0;
var gunBobbingRate = 250.0;
var gunFireFrameTimer = 0;
var gunFireFrameDelay = 100;
var canFireAgain = true;

var gunReloading = false;
var gunNoAmmoSound = {source:{buffer :null}}
var gunReloadFrameDelay = 100;
var gunReloadFrameTimer = gunReloadFrameDelay;

function changeGun(gunI)
{
    previousGun = currentGun;
    
    currentGun = gunI;

    if(previousGun > -1)
        gunTransition = -1;
    else
    {
        gun.transform.position.y = gunMaxY;
        gunTransition = 1;
    }
}

function totalGunsAvailable()
{
    var count = 0;
    for(let i = 0; i < availableGuns.length; i++)
        if(availableGuns[i]) count = count + 1;
    return count;
}

function playerSectorWallCheck(dist)
{
    var x1 = ray[ray.length/2].p.x;
    var y1 = ray[ray.length/2].p.y;
    var x2 = ray[ray.length/2].p.x + (dist * Math.cos(degToRad(ray[ray.length/2].angle)));
    var y2 = ray[ray.length/2].p.y + (dist * Math.sin(degToRad(ray[ray.length/2].angle)));

    if(typeof activeSector.sectorData.wallsLeft != "undefined")
    {
        for(let i = 0; i < activeSector.sectorData.wallsLeft.length; i++)
        {
            if(isLineOnLine(x1,y1,x2,y2,
            activeSector.sectorData.wallsLeft[i].p1.x,
            activeSector.sectorData.wallsLeft[i].p1.y,
            activeSector.sectorData.wallsLeft[i].p2.x,
            activeSector.sectorData.wallsLeft[i].p2.y))
                return true;
        }
    }
    if(typeof activeSector.sectorData.wallsRight != "undefined")
    {
        for(let i = 0; i < activeSector.sectorData.wallsRight.length; i++)
        {
            if(isLineOnLine(x1,y1,x2,y2,
            activeSector.sectorData.wallsRight[i].p1.x,
            activeSector.sectorData.wallsRight[i].p1.y,
            activeSector.sectorData.wallsRight[i].p2.x,
            activeSector.sectorData.wallsRight[i].p2.y))
                return true;
        }
    }

    return false;
}

function checkPlayerToEnemyShot()
{
    for(let i = 0; i < enemies.ents.length; i++)
    {
        var angBtwPlEn = radToDeg(plPos.angle(enemies.ents[i].p));
        var distBtwPlEn = plPos.distance(enemies.ents[i].p);
        var angPl = ray[ray.length/2].angle + 180;

        if(Math.abs(angBtwPlEn-angPl) < playerShotAccuracyFactor/distBtwPlEn)
        {
            if(!playerSectorWallCheck(distBtwPlEn-10))
            {
                if(typeof enemies.ents[i].hp != "undefined" && enemies.ents[i].hp > 0)
                {
                    enemies.ents[i].hp -= 1;

                    if(Math.random() < 0.5) decor.addUsingAnotherEntity(enemies.ents[i], ENT_EFFECT2);
                    else decor.addUsingAnotherEntity(enemies.ents[i], ENT_EFFECT3);
                }
                else
                {
                    decor.addUsingAnotherEntity(enemies.ents[i], ENT_DESTROY1);

                    enemiesKilled++;

                    removeEntityInAllSectors(enemies.ents[i]);
                    removeEntityInSector(enemies.ents[i]);
                    removeEntity(enemies.ents[i]);
                    enemies.ents.splice(i, 1);
                    i--;
                }

                //break;
            }
        }
    }
}

function checkPlayerToItemShot()
{
    for(let i = 0; i < items.ents.length; i++)
    {
        var angBtwPlEn = radToDeg(plPos.angle(items.ents[i].p));
        var distBtwPlEn = plPos.distance(items.ents[i].p);
        var angPl = ray[ray.length/2].angle + 180;

        if(Math.abs(angBtwPlEn-angPl) < playerShotAccuracyFactor/distBtwPlEn)
        {
            if(!playerSectorWallCheck(distBtwPlEn-10))
            {
                if(itemToPlayerShotReaction(items.ents[i]))
                {
                    removeEntityInAllSectors(items.ents[i]);
                    removeEntityInSector(items.ents[i]);
                    removeEntity(items.ents[i]);
                    items.ents.splice(i, 1);
                    i--;
                }
            }
        }
    }
}

function gunEvent()
{
    if(keysDown.indexOf(gunSwitchKeyPress) != -1
    && totalGunsAvailable() > 1
    && gunTransition == 0
    && !gunReloading)
    {
        if(!isKeyPressed(gunSwitchKeyPress))
        {
            if(availableGuns[currentGun + 1] && currentGun + 1 < totalGuns)
            {
                previousGun = currentGun;
                currentGun = currentGun + 1;
                gunTransition = -1;
            }
            else if(availableGuns[0])
            {
                previousGun = currentGun;
                currentGun = 0;
                gunTransition = -1;
            }
            else
            {
                previousGun = currentGun;
                currentGun = -1;
                gunTransition = -1;
            }
        }
    }
    else
    {
        removeKeyPressed(gunSwitchKeyPress);
    }

    if(keysDown.indexOf(gunReloadKeyPress) != -1
    && gunTransition == 0)
    {
        if(!isKeyPressed(gunReloadKeyPress))
        {
            if(currentGun == GUN_REVOLVER)
                audio.play1DSound(sounds[REVOLVER_RELOAD]);
            else if(currentGun == GUN_WINCHESTER)
                audio.play1DSound(sounds[WINCHESTER_RELOAD]);

            while(ammoInGun[currentGun] < gunAmmoCapacity[currentGun]
                && totalAmmo[currentGun] > 0)
            {
                ammoInGun[currentGun]++;
                totalAmmo[currentGun]--;
                currentGunFrame = 2;
                gunReloading = true;
            }
        }
    }
    else
    {
        removeKeyPressed(gunReloadKeyPress);
    }

    if(currentGun >= 0)
    {
        if(gunTransition == 0
            && gunFireFrameTimer <= 0
            && (isTouched || keysDown.indexOf(gunShootKeyPress) != -1)
            && canFireAgain)
        {
            if(currentGunFrame <= 0)
            {
                if(canFireAgain && ammoInGun[currentGun] > 0)
                {
                    ammoInGun[currentGun]--;

                    //SHOOTING!
                    checkPlayerToEnemyShot();
                    checkPlayerToItemShot();

                    if(currentGun == GUN_REVOLVER)
                        audio.play1DSound(sounds[REVOLVER_SHOT]);
                    else if(currentGun == GUN_WINCHESTER)
                        audio.play1DSound(sounds[WINCHESTER_SHOT]);

                    currentGunFrame = 1;
                    gunFireFrameTimer = gunFireFrameDelay;
                    canFireAgain = false;
                }
                else if(totalAmmo[currentGun] >= gunAmmoCapacity[currentGun])
                {
                    ammoInGun[currentGun] = gunAmmoCapacity[currentGun];
                    totalAmmo[currentGun] -= gunAmmoCapacity[currentGun];

                    if(currentGun == GUN_REVOLVER)
                        audio.play1DSound(sounds[REVOLVER_RELOAD]);
                    else if(currentGun == GUN_WINCHESTER)
                        audio.play1DSound(sounds[WINCHESTER_RELOAD]);

                    currentGunFrame = 2;
                }
                else if(totalAmmo[currentGun] > 0)
                {
                    ammoInGun[currentGun] = totalAmmo[currentGun];
                    totalAmmo[currentGun] = 0;

                    if(currentGun == GUN_REVOLVER)
                        audio.play1DSound(sounds[REVOLVER_RELOAD]);
                    else if(currentGun == GUN_WINCHESTER)
                        audio.play1DSound(sounds[WINCHESTER_RELOAD]);

                    currentGunFrame = 0;
                }
                else if (gunNoAmmoSound.source.buffer == null)
                {
                    gunNoAmmoSound = audio.play1DSound(sounds[SOUND_NOAMMO], rndAP(0.25, 0.2), rndAP(1, 0.01));
                }
            }
        }
        else if(!gunReloading)
        {
            if(gunTransition <= -1 && previousGun > -1) gun.imageObject = gunImages[previousGun];
            else gun.imageObject = gunImages[currentGun];

            if(gunFireFrameTimer <= 0)
            {
                currentGunFrame = 0;

                if(gunFireFrameTimer < -gunFireFrameDelay)
                    canFireAgain = true;
            }
        }
    }
}

function drawAllGunsDisplay(renderer)
{
    var gunXImg = 0;
    gunXImg = drawGunDisplay(renderer, GUN_REVOLVER, ENT_REVOLVERGUN, gunXImg);
    gunXImg = drawGunDisplay(renderer, GUN_WINCHESTER, ENT_WINCHESTERGUN, gunXImg);
}

function drawGunDisplay(renderer, gunIndex, entIndex, gunXImg)
{
    if(availableGuns[gunIndex])
    {
        if(currentGun != gunIndex) renderer.globalAlpha = gunDisplayInactiveAlpha;

        gunsDisplayUI.transform.position = gunDisplayUIOffset.add(vec2(gunXImg, 0));
        gunsDisplayUI.imageObject = entProp[entIndex].idleImg;
        gunsDisplayUI.drawScIn(vec2(0, 0), vec2(160, 160));

        if(currentGun != gunIndex) renderer.globalAlpha = 1;

        gunXImg += gunDisplayXIncrement;

        renderer.font = (scrSizeFactor * gunDisplayTextSize).toString() + "px Lucida, sans-serif";
        renderer.fillStyle = "#fff5f5";
        renderer.fillText(
            currentGun != gunIndex ? ammoInGun[gunIndex].toString() + "/" + totalAmmo[gunIndex].toString()
            : ((availableGuns[currentGun + 1] && currentGun + 1 < totalGuns) || (availableGuns[0] && currentGun + 1 >= totalGuns) ? "Q to Switch" : ""),
            (gunsDisplayUI.transform.position.add(gunDisplayTextOffset)).x,
            (gunsDisplayUI.transform.position.add(gunDisplayTextOffset)).y);
        return gunXImg;
    }
    return gunXImg;
}

function drawGun(deltaTime)
{
    gun.transform.position.x = screen.width/2 + (Math.sin(gunBobbingCounter) * 40.0);

    var gunMinY = gunDefMinY + Math.abs(Math.cos(gunBobbingCounter) * 15.0);

    if(gunTransition <= -1)
    {
        gun.transform.position.y = lerp(gun.transform.position.y, gunMaxY, gunTransitionLerpFactor * deltaTime);
        
        if(gun.transform.position.y >= gunMaxY - gunTransitionSnap)
        {
            gunTransition = 1;
            gun.transform.position.y = gunMaxY;
        }
    }
    else if(gunTransition >= 1)
    {
        gunTransition = 1;
        gun.transform.position.y = lerp(gun.transform.position.y, gunMinY, gunTransitionLerpFactor * deltaTime);
        
        if(gun.transform.position.y <= gunMinY + gunTransitionSnap)
        {
            gunTransition = 0;
        }
    }
    else if(gunTransition == 0) gun.transform.position.y = gunMinY;

    if(gunReloading)
    {
        if(gunReloadFrameTimer <= 0)
        {
            if(currentGunFrame < 2) currentGunFrame = 2;
            else if(currentGunFrame == 2) { currentGunFrame = 3; gunReloadFrameTimer += gunReloadFrameDelay*2; }
            else if(currentGunFrame == 3) currentGunFrame = 4;
            else if(currentGunFrame == 4) currentGunFrame = 5;
            else if(currentGunFrame == 5) gunReloading = false;

            gunReloadFrameTimer += gunReloadFrameDelay;
        }
        else
        {
            gunReloadFrameTimer -= deltaTime;
        }
    }
    else
    {
        gunFireFrameTimer -= deltaTime;
    }

    if(currentGun >= 0)
        if(typeof gun.imageObject != "undefined") gun.drawScIn(vec2(currentGunFrame * 480, 0), vec2(480, 480));
}