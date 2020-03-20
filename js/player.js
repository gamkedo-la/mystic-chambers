
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

var currentGun = -1;
var gunSwitchKeyPress = "q";
var gunReloadKeyPress = "r";
var availableGuns = [false, false];
var totalAmmo = [0, 0];
var ammoInGun = [0, 0];
var gunAmmoCapacity = [6, 12];
var ammoItemIncrement = [24, 12];
var gunReloading = false;

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

function playerInit()
{
    plPos = vec2(window.innerWidth / 2, window.innerHeight / 2);
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
        if(availableGuns[currentGun + 1] == true) currentGun++;
        else if(availableGuns[0] == true) currentGun = 0;
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
    var angleRange = 75.0;

    for(let i = 0; i < 4; i++)
        if(playerAngleMovement + angleRange > movementAngles[i]
        && playerAngleMovement - angleRange < movementAngles[i])
            currentSpeed[i] = 0;
}