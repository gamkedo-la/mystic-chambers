// AI routines

// to make an entity use one, assign a callback like this:
// myEntity.ai = aiFunctionNameBelow;

// note: entity position (this.p) is changed by camera movement!
// assume that this.p may be updated elsewhere as well as here

const DEBUGAI = false;

function aiWander(plRay) {
    var speed = 5000;
    var size = 0.1;
    
    if (DEBUGAI) console.log("aiWander for entity id " + this.id + " named " + this.name);
    if (DEBUGAI) console.log("pos: " + this.p.x+","+this.p.y+" angle: "+this.angle);
    
    // simply oscillate back and forth
    this.p.x += Math.cos(performance.now()/speed)*size;
}

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
            this.angle = rad; 
            // move toward target
            this.p.x += speed * Math.cos(rad);
            this.p.y += speed * Math.sin(rad);
        } else {
            if (DEBUGAI) console.log("too far from player. not seeking.");
        }
    } else {
        if (DEBUGAI) console.log("too close to player: seek paused")
    }



}

function aiAvoid(plRay) {
    
    aiSeek.call(this,plRay,true);

}