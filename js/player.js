
var playerMaxHealth = 100;
var playerHealth = playerMaxHealth;

//[forward, backward, left, right]
var keyPresses = ['w', 's', 'a', 'd'];
var movementAngles = [0.0, 180.0, 270.0, 90.0];
var currentSpeed = [0.0, 0.0, 0.0, 0.0];
var maxSpeed = [1.4, 1.2, 0.8, 0.8];
var speedIncrement = 0.004;
var speedDecrement = 0.006;
var speedThreshold = 0.16;

var playerAngleMovement = true;
var playerCalculatedAngleMovement = 0.0;

var jumpKeyPress = 'f';
var jumpOffset = 0.0;
var jumpActive = false;
var jumpFall = false;
var jumpMaxOffset = 80.0;
var jumpSpeed = 0.8;
var jumpFallShake = -10.0;
var jumpFallFactor = 0.3;
var jumpRecoverFactor = 0.8;
var jumpSetZero = 2.0;

var rayAngleDiff = 0;
var rayRenderFOV = 0;

//GUNS
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

var gunsDisplayUI = new Sprite(tr(vec2(), vec2(0.5, 0.5)), undefined);
var gunDisplayUIOffset = vec2(60.0, 40.0);
var gunDisplayXIncrement = 120.0;
var gunDisplayInactiveAlpha = 0.25;
var gunDisplayTextOffset = vec2(-20.0, 60.0);
var gunDisplayTextSize = 0.03;

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
var gunMoveCounter = 0;

//KEYS
var KEY_RED = 0;
var KEY_GREEN = 1;
var KEY_BLUE = 2;
var totalKeys = 3;
var availableKeys = [false, false, false];
var keysDisplayUI = new Sprite(tr(vec2(), vec2(0.5, 0.5)), undefined);
var keyDisplayUIOffset = vec2(screen.width * 0.2, screen.height - (screen.height/8.6));
var keyDisplayXIncrement = 40.0;

function playerInit()
{
    plPos = vec2(580, 270);//window.innerWidth / 2, window.innerHeight / 2);
    prevPlPos = vec2(plPos.x, plPos.y);

    ray = [];
    rayAngleDiff = platform == ANDROID ? 0.5 : 0.25;
    rayRenderFOV = platform == ANDROID ? 30.0 : 45.0;

    for (let i = -rayRenderFOV; i < 0.0; i += rayAngleDiff)
        ray.push(new Ray(plPos, i));
}

function playerEvents(deltaTime)
{
    if(playerAngleMovement)
    {
        for (let i = 0; i < ray.length; i++)
        {
            if(isTouchMoved)
                ray[i].angle = lerp(ray[i].angle, ray[i].angle + relTouchPos[0].x, 0.5 );

            if (ray[i].angle >= 0.0)
                ray[i].angle -= 360.0;
            else if (ray[i].angle <= -360.0)
                ray[i].angle += 360.0;
        }
        relTouchPos[0] = vec2(0.0, 0.0);
    }

    if(jumpActive)
    {
        jumpOffset = lerp(jumpOffset, jumpMaxOffset + 1, jumpSpeed);

        if(jumpOffset >= jumpMaxOffset - jumpSetZero)
        {
            jumpActive = false;
            jumpFall = true;

            jumpOffset = jumpMaxOffset;
        }
    }
    else if(jumpFall)
    {
        jumpOffset = lerp(jumpOffset, -1, jumpFallFactor);

        if(jumpOffset <= jumpSetZero)
        {
            jumpActive = false;
            jumpFall = false;
            
            jumpOffset = jumpFallShake;
        }
    }
    else if(jumpOffset < 0 || jumpOffset > 0)
    {
        jumpOffset = lerp(jumpOffset, 0, jumpRecoverFactor);

        if(jumpOffset <= jumpSetZero && jumpOffset >= -jumpSetZero) jumpOffset = 0.0;
    }
    else if(keysDown.indexOf(jumpKeyPress) != -1)
    {
        jumpActive = true;
        jumpFall = false;

        jumpOffset = 0;
    }

    if(keysDown.indexOf(gunSwitchKeyPress) != -1)
    {
        if(availableGuns[currentGun + 1] && currentGun + 1 < totalGuns) currentGun++;
        else if(availableGuns[0]) currentGun = 0;
        else currentGun = -1;
    }
    if(keysDown.indexOf(gunReloadKeyPress) != -1)
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
    if(keysDown.indexOf('m') != -1)
    {
        playerAngleMovement = !playerAngleMovement;
    }
    
    for(let keyI = 0; keyI < 4; keyI++)
    {
        plPos.x += currentSpeed[keyI] * Math.cos(degToRad(ray[ray.length / 2].angle + movementAngles[keyI]));
        plPos.y += currentSpeed[keyI] * Math.sin(degToRad(ray[ray.length / 2].angle + movementAngles[keyI]));

        gunMoveCounter += (currentSpeed[keyI] * deltaTime) / 300.0;

        if(keysDown.indexOf(keyPresses[keyI]) != -1
        || (platform == ANDROID && gameplayUI[gameplayUI.length - 1 - keyI].button.output == UIOUTPUT_SELECT))
        {
            if(currentSpeed[keyI] >= 0.0)
                currentSpeed[keyI] += speedIncrement * deltaTime;
            else
                currentSpeed[keyI] += (speedIncrement + speedDecrement) * deltaTime;

            if(currentSpeed[keyI] > maxSpeed[keyI]) currentSpeed[keyI] = maxSpeed[keyI];
        }
        else
        {
            if(currentSpeed[keyI] > speedThreshold) currentSpeed[keyI] -= speedDecrement * deltaTime;
            else if(currentSpeed[keyI] < -speedThreshold) currentSpeed[keyI] += speedDecrement * deltaTime;
            else currentSpeed[keyI] = 0;
        }

        for (let i = 0; i < ray.length; i++)
        {
            ray[i].p = plPos;
        }
    }

    if(currentGun >= 0)
    {
        if(isTouched)
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
            }
        }
        else if(!gunReloading)
        {
            gun.imageObject = gunImages[currentGun][0];
        }
        gunReloading = false;
    }

    audio.audioListener.setPosition(plPos.x, plPos.y, 0);
}

function haltPlayer()
{
    for(let i = 0; i < 4; i++)
        currentSpeed[i] = 0;
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

function getEntKey(i)
{
    switch(i)
    {
        case KEY_RED:
            return ENT_REDKEY;
        case KEY_GREEN:
            return ENT_GREENKEY;
        case KEY_BLUE:
            return ENT_BLUEKEY;
        default:
            return 0;
    }
}

function drawKeysDisplay(renderer)
{
    var keyXImg = 0;
    for(let i = 0; i < totalKeys; i++)
    {
        if(availableKeys[i])
        {
            keysDisplayUI.transform.position = keyDisplayUIOffset.add(vec2(keyXImg, 0));
            keysDisplayUI.imageObject = entImg[getEntKey(i)];
            keysDisplayUI.drawScIn(vec2(0, 0), vec2(160, 160));
            keyXImg += keyDisplayXIncrement;
        }
    }
}