// AI routines

// FIXME: these are using a fixed framerate, not delta time

// to make an entity use one, assign a callback like this:
// myEntity.ai = aiFunctionNameBelow;

// note: entity position (this.p) is changed by camera movement!
// assume that this.p may be updated elsewhere as well as here

const DEBUGAI = false; // output to debug.log?
const DO_NOT_UPDATE_WALL_DIR = true; // read-only collision detection

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
function aiWander(plRay) {
    var speed = 5000;
    var size = 0.1;
    
    if (DEBUGAI) console.log("aiWander for entity id " + this.id + " named " + this.name);
    if (DEBUGAI) console.log("pos: " + this.p.x+","+this.p.y+" angle: "+this.angle);
    
    this.p.x += Math.cos(performance.now()/speed)*size;
}

// move randomly using car-like turns!
function aiExplore(p1Ray) {
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
function aiSeek(plRay, backwards) {
    
    if (DEBUGAI) console.log("aiSeek"+(backwards?" (AVOID)":"")+" for entity id " + this.id + " named " + this.name);
    if (DEBUGAI) console.log("pos: " + this.p.x+","+this.p.y+" angle: "+this.angle);

    var speed = 0.25;
    if (backwards) speed *= -1;

    var mindist = 8; // don't get too close
    var maxdist = 250; // player is ignored beyond this distance

    var dist = plRay.p.distance(this.p);

    if (DEBUGAI) console.log(dist.toFixed(1)+"m to p1Ray: " + plRay.p.x.toFixed(1)+","+plRay.p.y.toFixed(1)+" angle: "+plRay.angle.toFixed(1));

    // move if not too close
    if (dist>mindist) {
        if (dist<maxdist) {

            // determine target direction
            var rad = plRay.p.angle(this.p);
            // actually face the direction of travel
            this.aimAngleRadians = rad; 

            validateRotation.call(this); // stay in 0..360 deg

            if(typeof this.prev_p == "undefined") this.prev_p = vec2(0, 0);
            this.prev_p = vec2(this.p.x, this.p.y);

            // move toward target
            this.p.x += speed * Math.cos(rad);
            this.p.y += speed * Math.sin(rad);

            validatePosition.call(this); // collide with walls

        } else {
            if (DEBUGAI) console.log("too far from player. not seeking.");
        }
    } else {
        if (DEBUGAI) console.log("too close to player: seek paused")
    }

}

// move away from the player
function aiAvoid(plRay) {
    aiSeek.call(this,plRay,true);
}

// spin around and bob up and down
function aiSpinning(p1Ray) {
    var speed = 0.1;
    this.aimAngleRadians = this.aimAngleRadians + speed;
    validateRotation.call(this); // stay in 0..360 deg
}

// spin around and bob up and down
function aiSpinningBobbing(p1Ray) {
    var speed = 0.05;
    var bobspeed = 350;
    var bobsize = 100;
    this.aimAngleRadians = this.aimAngleRadians + speed;
    validateRotation.call(this); // stay in 0..360 deg
    // up and down like a doom weapon
    this.renderOffset.y = ((Math.cos(performance.now()/bobspeed)+1)/2)*bobsize;
}
