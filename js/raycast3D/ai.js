// AI routines

// FIXME: these are using a fixed framerate, not delta time

// to make an entity use one, assign a callback like this:
// myEntity.ai = aiFunctionNameBelow;

// note: entity position (this.p) is changed by camera movement!
// assume that this.p may be updated elsewhere as well as here

const DEBUGAI = false; // output to debug.log?
const DO_NOT_UPDATE_WALL_DIR = true; // read-only collision detection

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
    var speed = 5000;
    var size = 0.1;
    
    if (DEBUGAI) console.log("aiWander for entity id " + this.id + " named " + this.name);
    if (DEBUGAI) console.log("pos: " + this.p.x+","+this.p.y+" angle: "+this.angle);
    
    this.p.x += Math.cos(performance.now()/speed)*size;
}

// move randomly using car-like turns!
function aiExplore() {
    var speed = 0.25;
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
    this.p.x += speed * Math.cos(this.aimAngleRadians);
    this.p.y += speed * Math.sin(this.aimAngleRadians);

    validatePosition.call(this); // collide with walls
}

// move toward the player
function aiSeek(plRay, backwards=false,mindist=0,maxdist=250) {
    
    if (DEBUGAI) console.log("aiSeek"+(backwards?" (AVOID)":"")+" for entity id " + this.id + " named " + this.name);
    if (DEBUGAI) console.log("pos: " + this.p.x.toFixed(1)+","+this.p.y.toFixed(1)+" angle: "+this.angle.toFixed(1));

    // this is recorded here only for debug red line display in entity draw
    this.debugTarget = plRay.p.subtract(aiOffset);
    
    var speed = 0.25;
    if (backwards) speed *= -1;

    var dist = plRay.p.distance(this.p);

    if (DEBUGAI) console.log(dist.toFixed(1)+"m to target: " + plRay.p.x.toFixed(1)+","+plRay.p.y.toFixed(1)+" angle: "+plRay.angle.toFixed(1));

    // move if not too close
    if (dist>mindist) {
        if (dist<maxdist) {

            // determine target direction
            var rad = plRay.p.angle(this.p);
            // actually face the direction of travel
            this.aimAngleRadians = rad; 

            validateRotation.call(this); // stay in 0..360 deg

            if(typeof this.prev_p == "undefined") this.prev_p = vec2(0, 0);
            this.prev_p = vec2(this.p.x, this.p.y); // FIXME: bad for GC, we create a new obj every frame

            // move toward target
            // FIXME: this.p cannot be relied upon
            // it changes somewhere else even if speed is 0
            this.p.x += speed * Math.cos(rad);
            this.p.y += speed * Math.sin(rad);

            validatePosition.call(this); // collide with walls

        } else {
            if (DEBUGAI) console.log("too far from player. not seeking.");
        }
    } else {
        if (DEBUGAI) console.log("too close to player: seek paused");
    }

}

// move away from the player
function aiAvoid(plRay) {
    aiSeek.call(this,plRay,true);
}

// spin around and bob up and down
function aiSpinning() {
    var speed = 0.1;
    this.aimAngleRadians = this.aimAngleRadians + speed;
    validateRotation.call(this); // stay in 0..360 deg
}

// spin around and bob up and down
function aiSpinningBobbing() {
    var speed = 0.025;
    var bobspeed = 350;
    //var bobsize = 100;
    this.aimAngleRadians = this.aimAngleRadians + speed;
    validateRotation.call(this); // stay in 0..360 deg
    // up and down like a doom weapon
    this.bobbingFactor = (Math.floor(((Math.cos(performance.now()/bobspeed)+1)/2) * 15.0))/15;
    //this.renderOffset.y = ((Math.cos(performance.now()/bobspeed)+1)/2)*bobsize;
}

// falling from the ceiling to the floor
function aiDripping() {
    //console.log("yay, a dripping entity!");
    var speed = 0.1;
    var min = 0;
    var max = 1;
    this.bobbingFactor += speed; // height = renderOffset.y * this
    if (this.bobbingFactor>max) this.bobbingFactor=min;
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
