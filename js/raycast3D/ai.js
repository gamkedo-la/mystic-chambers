// AI routines

// FIXME: these are using a fixed framerate, not delta time

// to make an entity use one, assign a callback like this:
// myEntity.ai = aiFunctionNameBelow;

// note: entity position (this.p) is changed by camera movement!
// assume that this.p may be updated elsewhere as well as here

const DEBUGAI = false; // output to debug.log?
const DO_NOT_UPDATE_WALL_DIR = true; // read-only collision detection

const FIRESKULL_DODGE_SPD = 0.05; // circle strafe dodge back and forth while moving
const FIRESKULL_SEEK_NEAR = 13;
const FIRESKULL_SEEK_FAR = 250;

const DODGE_CHANCE = 0.01;
const DODGE_MINTIME = 10;
const DODGE_MAXTIME = 60;

var aiOffset = vec2(0,0);

// random from 0..360 deg (0..2pi)
function randomAngleRadians() {
    return Math.random()*Math.PI*2;
}

// check for wall collisions and warp back to prev pos if needed
function validatePosition()
{
    this.p = collisionWithWallsInSector(this.p, this.prev_p, this.sector, DO_NOT_UPDATE_WALL_DIR);
    this.p = collisionWithSectorsInSector(this.p, this.prev_p, this.sector, DO_NOT_UPDATE_WALL_DIR);
}

// ensure it is in the range 0..360 in radians, wrapping around
function validateRotation() {
    if (this.aimAngleRadians>Math.PI*2) this.aimAngleRadians -= Math.PI*2;
    if (this.aimAngleRadians<0) this.aimAngleRadians += Math.PI*2;
}

// move back and forth
function aiWander() {
    var size = 0.1;
    
    if (DEBUGAI) console.log("aiWander for entity id " + this.id + " named " + this.name);
    if (DEBUGAI) console.log("pos: " + this.p.x+","+this.p.y+" angle: "+this.angle);
    
    this.p.x += Math.cos(performance.now()/this.speed)*size;
}

// move randomly using car-like turns!
function aiExplore() {
    var turnspeed = 0.05;
    
    // choose a random direction to travel from time to time
    if (this.ExploreTimer==undefined) this.ExploreTimer = 30;
    if (this.ExploreAngle==undefined) this.ExploreAngle = this.aimAngleRadians;

    this.ExploreTimer--;
    if (this.ExploreTimer<0) {
        if (DEBUGAI) console.log("aiExplore: time to change directions!");
        this.ExploreAngle = randomAngleRadians();
        this.ExploreTimer = 20 + Math.random()*120;
    }

    // FIXME: doesn't necessarily choose the shortest direction to turn 
    // (eg goes the long way around from 10 to 350)
    if (this.aimAngleRadians>this.ExploreAngle) this.aimAngleRadians -= turnspeed;
    if (this.aimAngleRadians<this.ExploreAngle) this.aimAngleRadians += turnspeed;

    validateRotation.call(this); // stay in 0..360 deg

    if(typeof this.prev_p == "undefined") this.prev_p = vec2(0, 0);
    this.prev_p = vec2(this.p.x, this.p.y);

    // move in the direction we are facing
    this.p.x += this.speed * Math.cos(this.aimAngleRadians);
    this.p.y += this.speed * Math.sin(this.aimAngleRadians);

    validatePosition.call(this); // collide with walls
}

// move toward the player
function aiSeek(plRay, backwards=false,mindist=0,maxdist=250) {
    
    if (DEBUGAI) console.log("aiSeek"+(backwards?" (AVOID)":"")+" for entity id " + this.id + " named " + this.name);
    if (DEBUGAI) console.log("pos: " + this.p.x.toFixed(1)+","+this.p.y.toFixed(1)+" angle: "+this.angle.toFixed(1));

    if(typeof this.targetPosition != "undefined")
    {
        this.tempPlRayPosX = plRay.p.x;
        this.tempPlRayPosY = plRay.p.y;
        plRay.p.x = this.targetPosition.x;
        plRay.p.y = this.targetPosition.y;
    }

    // this is recorded here only for debug red line display in entity draw
    this.debugTarget = plRay.p.subtract(aiOffset);

    var dist = plRay.p.distance(this.p);

    if (DEBUGAI) console.log(dist.toFixed(1)+"m to target: " + plRay.p.x.toFixed(1)+","+plRay.p.y.toFixed(1)+" angle: "+plRay.angle.toFixed(1));

    // move if not too close
    if (dist>mindist) {
        if (dist<maxdist) {
            //var turnspeed = 0.05;

            // determine target direction
            var rad = plRay.p.angle(this.p);

            // actually face the direction of travel
            this.aimAngleRadians = rad;
            //if (this.aimAngleRadians>spriteAngle) this.aimAngleRadians -= turnspeed;
            //if (this.aimAngleRadians<spriteAngle) this.aimAngleRadians += turnspeed;

            validateRotation.call(this); // stay in 0..360 deg

            if(typeof this.prev_p == "undefined") this.prev_p = vec2(0, 0);
            this.prev_p.x = this.p.x;
            this.prev_p.y = this.p.y;

            // move toward target
            // FIXME: this.p cannot be relied upon
            // it changes somewhere else even if speed is 0
            if(backwards)
            {
                this.p.x -= this.speed * Math.cos(this.aimAngleRadians);
                this.p.y -= this.speed * Math.sin(this.aimAngleRadians);
            }
            else
            {
                this.p.x += this.speed * Math.cos(this.aimAngleRadians);
                this.p.y += this.speed * Math.sin(this.aimAngleRadians);
            }

            validatePosition.call(this); // collide with walls

        } else {
            if (DEBUGAI) console.log("too far from player. not seeking.");
        }
    } else {
        if (DEBUGAI) console.log("too close to player: seek paused");
    }

    if(typeof this.targetPosition != "undefined")
    {
        plRay.p.x = this.tempPlRayPosX;
        plRay.p.y = this.tempPlRayPosY;
        this.tempPlRayPosX = undefined;
        this.tempPlRayPosY = undefined;
    }

}

function aiDodge(plRay,strafeSize=0.1) {
    // classic FPS CIRCLE STRAFE
    // to "strafe" means to move side-to-side perpendicular to the target
    // like dodging back and forth to avoid getting hit
    if (strafeSize) {
        if (this.strafeCounter == undefined) this.strafeCounter = 0;
        this.strafeCounter--;
        if (this.strafeCounter > 0) {
            this.p.x += this.strafeDirection * strafeSize * Math.cos(this.aimAngleRadians+1.5708); // +90 deg
            this.p.y += this.strafeDirection * strafeSize * Math.sin(this.aimAngleRadians+1.5708);
        } else { // not currently strafing
            if (Math.random() < DODGE_CHANCE) { // occasionally
                this.strafeCounter = Math.round(DODGE_MINTIME+Math.random()*(DODGE_MAXTIME-DODGE_MINTIME)); // for how long?
                this.strafeDirection = Math.random()<0.5?1:-1; // left or right?
                if (DEBUGAI) console.log("Starting to circle strafe dodge! Duration:"+this.strafeCounter+" Direction:"+this.strafeDirection);
            }
        }
    } // circle strafe
    
    validateRotation.call(this); // stay in 0..360 deg - not sure if this is required
}

// move away from the player
function aiAvoid(plRay) {
    aiSeek.call(this,plRay,true);
}

// spin around and bob up and down
function aiSpinning() {
    var spd = 0.1;
    this.aimAngleRadians = this.aimAngleRadians + spd;
    validateRotation.call(this); // stay in 0..360 deg

    //Idle Play Sounds START
    switch(this.id)
    {
        case ENT_FIRE:
            if(typeof this.fireSound == "undefined")
                this.fireSound = {source:{buffer :null}};
            
            if(this.fireSound.source == null
            || this.fireSound.source.buffer == null)
                this.fireSound = audio.play3DSound(sounds[FIRE], this.p, rndAP(), rndAP());
            break;

        case ENT_FIRE_MYSTIC:
            if(typeof this.fireSound == "undefined")
                this.fireSound = {source:{buffer :null}};
            
            if(this.fireSound.source == null
            || this.fireSound.source.buffer == null)
                this.fireSound = audio.play3DSound(sounds[FIRE], this.p, rndAP(), rndAP());
            break;

        case ENT_FIRE_COLD:
            if(typeof this.fireSound == "undefined")
                this.fireSound = {source:{buffer :null}};
            
            if(this.fireSound.source == null
            || this.fireSound.source.buffer == null)
                this.fireSound = audio.play3DSound(sounds[FIRE], this.p, rndAP(), rndAP());
            break;

        case ENT_PORTAL:
            if(typeof this.portalSound == "undefined")
                this.portalSound = {source:{buffer :null}};
            
            if(this.portalSound.source == null
            || this.portalSound.source.buffer == null)
                this.portalSound = audio.play3DSound(sounds[PORTAL], this.p, rndAP(), rndAP());
            break;
    }
    //Idle Play Sounds END
}

// spin around and bob up and down
function aiSpinningBobbing() {
    var spd = 0.025;
    var bobspeed = 350;
    //var bobsize = 100;
    this.aimAngleRadians = this.aimAngleRadians + spd;
    validateRotation.call(this); // stay in 0..360 deg
    // up and down like a doom weapon
    this.bobbingFactor = (Math.floor(((Math.cos(performance.now()/bobspeed)+1)/2) * 15.0))/15;
    //this.renderOffset.y = ((Math.cos(performance.now()/bobspeed)+1)/2)*bobsize;
}

// falling from the ceiling to the floor
function aiDripping() {
    var preparingMin = 0.25;
    var preparingMax = 0.6;
    var min = -2.5;
    var max = 2.5;
    var spd = 0.25;
    if(this.bobbingFactor < min)
        spd = 0.00025 + ((min - this.bobbingFactor) * 0.025);
    if(this.bobbingFactor > min - preparingMin)
        this.dontRender = undefined;
    
    this.bobbingFactor += spd; // height = renderOffset.y * this

    if (this.bobbingFactor > max)
    {
        this.bobbingFactor = min - (preparingMin + (Math.random() * preparingMax));
        this.delay = 200;
        this.dontRender = true;

        audio.play3DSound(sounds[DRIP], this.p, rndAP(), rndAP());
    }
}

// seeks any nearby entities like health, ammo, guns, and WAYPOINTS
var waypoints = [];
function aiWaypointNavigation() {

    // init
    if (!this.wpTarget) {
        if (DEBUGAI) console.log("initializing waypoint navigation");
        this.wpTarget = items.ents[Math.floor(Math.random() * items.ents.length)];
        this.wpPrev = items.ents[Math.floor(Math.random() * items.ents.length)];
        this.wpTimeleft = 0;
    }

    // get bored after a while
    this.wpTimeleft--;
    
    if (this.wpTimeleft<=0) {
        if (DEBUGAI) console.log("time for a new waypoint");
        this.wpPrev = this.wpTarget;
        while (this.wpTarget == this.wpPrev) { // avoid picking the same one twice in a row
            this.wpTarget = items.ents[Math.floor(Math.random() * items.ents.length)];
        }
        this.wpTimeleft = Math.random()*500;
        if (DEBUGAI) console.log("new waypoint is " + this.wpTarget.name+" at "+this.wpTarget.p.x.toFixed(1)+","+this.wpTarget.p.y.toFixed(1));
    }

    // FIXME: act differently depending on what ENT_* type it is
    // and sort by distance to pick closest
    //for(let i = 0; i < items.ents.length; i++) {
    //    if (items.ents[i]. == 
    //}

    aiSeek.call(this,this.wpTarget);

}

function fireSkullAI(plRay,deltaTime)
{
    console.log(this.targetPosition);

    if(typeof this.aiStage == "undefined") this.aiStage = -1;
    if(typeof this.stopTimer == "undefined") this.stopTimer = 0;
    if(typeof this.attackTimer == "undefined") this.attackTimer = 0;
    if(typeof this.normalTimer == "undefined") this.normalTimer = 0;
    if(typeof this.hp == "undefined") this.hp = 5;

    var dist = plRay.p.distance(this.p);

    if(dist > 160 && typeof this.targetPosition == "undefined")
    {
        aiExplore.call(this,plRay);
        if (Math.random() < 0.0005 * deltaTime)
        {
        	audio.play3DSound(sounds[FIRESKULL_IDLE], this.p, rndAP(), rndAP());
        }
    }
    else
    {
        // move towards the player if they are close by
        aiSeek.call(this,plRay,false,FIRESKULL_SEEK_NEAR,FIRESKULL_SEEK_FAR);
        // dodge back and forth occasionally
        aiDodge.call(this,plRay,FIRESKULL_DODGE_SPD);

        if(dist > 40 && typeof this.targetPosition == "undefined")
        {
            this.speed = 0.15;
            this.stopTimer = this.attackTimer = this.normalTimer = this.aiStage = -1;
        }
        else
        {
            if(this.aiStage <= -1 && this.stopTimer <= 0)
            {
                this.stopTimer = 1000;
                this.aiStage = 0;
            }
            else if(this.aiStage == 0 && this.attackTimer <= 0
            && typeof this.targetPosition == "undefined")
            {
                this.targetPosition = vec2(plRay.p.x, plRay.p.y);
                this.attackTimer = 400;
                this.aiStage = 1;
            }
            else if(this.aiStage == 1 && this.normalTimer <= 0
            && this.attackTimer <= 0)
            {
                this.targetPosition = undefined;
                this.normalTimer = 3000;
                this.aiStage = 2;
            }
            else if(this.aiStage == 2 && this.normalTimer <= 0)
            {
                this.aiStage = -1;
            }

            if(this.stopTimer > 0) { this.speed = 0.0; this.stopTimer -= deltaTime; }
            else if(this.attackTimer > 0) { this.speed = 2.0; this.attackTimer -= deltaTime; }
            else if(this.normalTimer > 0) { this.speed = 0.4; this.normalTimer -= deltaTime; }

            if(dist < 28 && this.stopTimer > 0) this.speed = -1.0;
            else if(dist < 16 && this.attackTimer > 0)
            {
                playerHealth -= 20;
                flash = flashTime;
                flashColor = playerDamageFlashColor;
                //plRay.p.x -= Math.cos(degToRad(ray[ray.length/2].angle))*4.0;
                //plRay.p.y -= Math.sin(degToRad(ray[ray.length/2].angle))*4.0;
                plKnockBack = vec2(4.0, 4.0);
                this.attackTimer = 0;
                this.targetPosition = undefined;

                audio.play1DSound(sounds[PLAYER_HURT+rndOff()]);
            }
        }
    }

    if(typeof this.damageDelay != "undefined" && this.damageDelay > 0) this.speed = -1.0;
}

function evilDwarfAI(plRay,deltaTime)
{
    if(typeof this.aiStage == "undefined") this.aiStage = -1;
    if(typeof this.stopTimer == "undefined") this.stopTimer = 0;
    if(typeof this.attackTimer == "undefined") this.attackTimer = 0;
    if(typeof this.normalTimer == "undefined") this.normalTimer = 0;

    // fragile and slow
    if(typeof this.hp == "undefined") this.hp = 1; 
    const exploredist = 150;
    const attackrange = 30;
    const seekspeed = 0.1;
    const attackspeed = 2; // fast attack
    const normalspeed = 0.2; // really slow
    const meleerange = 10; // longish reach
    const meleedamage = 1; // weak punch
    const evadespeed = -1; // not sure

    var dist = plRay.p.distance(this.p);

    if(dist > exploredist)
    {
        aiExplore.call(this,plRay);
        if (Math.random() < 0.0005 * deltaTime) 
        {
        	audio.play3DSound(sounds[FIRESKULL_IDLE], this.p, rndAP(), rndAP());
        }
    }
    else
    {
        // move towards the player if they are close by
        aiSeek.call(this,plRay,false,FIRESKULL_SEEK_NEAR,FIRESKULL_SEEK_FAR);
        // dodge back and forth occasionally
        aiDodge.call(this,plRay,FIRESKULL_DODGE_SPD);

        if(dist > attackrange)
        {
            this.speed = seekspeed;
            this.stopTimer = this.attackTimer = this.normalTimer = this.aiStage = -1;
        }
        else
        {
            if(this.aiStage <= -1 && this.stopTimer <= 0)
            {
                this.stopTimer = 300;
                this.aiStage = 0;
            }
            else if(this.aiStage == 0 && this.attackTimer <= 0)
            {
                this.attackTimer = 300;
                this.aiStage = 1;
            }
            else if(this.aiStage == 1 && this.normalTimer <= 0)
            {
                this.normalTimer = 1200;
                this.aiStage = 2;
            }
            else if(this.aiStage == 2 && this.normalTimer <= 0)
            {
                this.aiStage = -1;
            }

            if(this.stopTimer > 0) { this.speed = 0.0; this.stopTimer -= deltaTime; }
            else if(this.attackTimer > 0) { this.speed = attackspeed; this.attackTimer -= deltaTime; }
            else if(this.normalTimer > 0) { this.speed = normalspeed; this.normalTimer -= deltaTime; }

            if(dist < meleerange && this.attackTimer > 0)
            {
                playerHealth -= meleedamage;
                flash = flashTime;
                flashColor = playerDamageFlashColor;
                plRay.p.x -= Math.cos(degToRad(ray[ray.length/2].angle));
                plRay.p.y -= Math.sin(degToRad(ray[ray.length/2].angle));
                this.attackTimer = 0;

                audio.play1DSound(sounds[PLAYER_HURT+rndOff()]);
            }
        }
    }

    if(typeof this.damageDelay != "undefined" && this.damageDelay > 0) this.speed = evadespeed;
}