
const GUN_REVOLVER = 0;
const GUN_WINCHESTER = 1;

var totalGuns = 2;
var availableGuns = [false, false];
var totalAmmo = [0, 0];
var ammoInGun = [0, 0];
var gunAmmoCapacity = [6, 12];
var ammoItemIncrement = [24, 12];
var gunReloading = false;
var currentGun = -1;
var gunSwitchKeyPress = "q";
var gunReloadKeyPress = "r";

var previousGun = -1;
var gunTransition = 0;
var gunYPos = 0;
var gunTransitionLerpFactor = 0.25;
var gunTransitionSnap = 10;

var gunsDisplayUI = new Sprite(tr(vec2(), vec2(0.5, 0.5)), undefined);
var gunDisplayUIOffset = vec2(60.0, 40.0);
var gunDisplayXIncrement = 120.0;
var gunDisplayInactiveAlpha = 0.25;
var gunDisplayTextOffset = vec2(-20.0, 60.0);
var gunDisplayTextSize = 0.03;

var gunMaxY = screen.height + 240;
var gunDefMinY = screen.height - 240;

var gunImages = [
    [
        new ImageObject("images/revolver.png", vec2(480, 480)),
        new ImageObject("images/revolverFire.png", vec2(480, 480)),
        new ImageObject("images/revolverReload.png", vec2(480, 480)),
    ],
    [
        new ImageObject("images/winchester.png", vec2(480, 480)),
        new ImageObject("images/winchesterFire.png", vec2(480, 480)),
        new ImageObject("images/winchesterReload.png", vec2(480, 480)),
    ],
];
var gun = new Sprite(tr(vec2(screen.width/2, 0)), undefined);
var gunBobbingCounter = 0;
var gunBobbingRate = 250.0;

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

function gunEvent()
{
    if(keysDown.indexOf(gunSwitchKeyPress) != -1
    && totalGunsAvailable() > 1
    && gunTransition == 0)
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
            while(ammoInGun[currentGun] < gunAmmoCapacity[currentGun]
                && totalAmmo[currentGun] > 0)
            {
                ammoInGun[currentGun]++;
                totalAmmo[currentGun]--;
                gun.imageObject = gunImages[currentGun][2];
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
        if(gunTransition == 0 && isTouched)
        {
            if(gun.imageObject != gunImages[currentGun][1]
            && gun.imageObject != gunImages[currentGun][2])
            {
                if(ammoInGun[currentGun] > 0)
                {
                    ammoInGun[currentGun]--;

                    gun.imageObject = gunImages[currentGun][1];
                }
                else if(totalAmmo[currentGun] >= gunAmmoCapacity[currentGun])
                {
                    ammoInGun[currentGun] = gunAmmoCapacity[currentGun];
                    totalAmmo[currentGun] -= gunAmmoCapacity[currentGun];

                    gun.imageObject = gunImages[currentGun][2];
                }
                else if(totalAmmo[currentGun] > 0)
                {
                    ammoInGun[currentGun] = totalAmmo[currentGun];
                    totalAmmo[currentGun] = 0;

                    gun.imageObject = gunImages[currentGun][0];
                }
                else
                {
                    audio.playOneshot(sounds[SOUND_NOAMMO], plPos);
                }
            }
        }
        else if(!gunReloading)
        {
            if(gunTransition <= -1 && previousGun > -1) gun.imageObject = gunImages[previousGun][0];
            else gun.imageObject = gunImages[currentGun][0];
        }
        gunReloading = false;
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
        gunsDisplayUI.imageObject = entImg[entIndex];
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

function drawGun()
{
    gun.transform.position.x = screen.width/2 + (Math.sin(gunBobbingCounter) * 40.0);

    var gunMinY = gunDefMinY + Math.abs(Math.cos(gunBobbingCounter) * 15.0);

    if(gunTransition <= -1)
    {
        gun.transform.position.y = lerp(gun.transform.position.y, gunMaxY, gunTransitionLerpFactor);
        
        if(gun.transform.position.y >= gunMaxY - gunTransitionSnap)
        {
            gunTransition = 1;
            gun.transform.position.y = gunMaxY;
        }
    }
    else if(gunTransition >= 1)
    {
        gunTransition = 1;
        gun.transform.position.y = lerp(gun.transform.position.y, gunMinY, gunTransitionLerpFactor);
        
        if(gun.transform.position.y <= gunMinY + gunTransitionSnap)
        {
            gunTransition = 0;
        }
    }
    else if(gunTransition == 0) gun.transform.position.y = gunMinY;


    if(currentGun >= 0)
        if(!mapMode && typeof gun.imageObject != "undefined") gun.drawSc();
}