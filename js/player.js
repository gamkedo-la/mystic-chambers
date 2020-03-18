
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

var jumpKeyPress = 'q';
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

var gunMoveCounter = 0;

function playerInit()
{
    plPos = vec2(window.innerWidth / 2, window.innerHeight / 2);
    prevPlPos = plPos;

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
    else if(keysDown.indexOf('m') != -1)
    {
        playerAngleMovement = !playerAngleMovement;
    }

    prevPlPos = plPos;
    
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

    if(isTouched)
        revolver.imageObject = revolverImages[1];
    else
        revolver.imageObject = revolverImages[0];

    audio.audioListener.setPosition(plPos.x, plPos.y, 0);
}