// AI routines

// to make an entity use one, assign a callback like this:
// myEntity.ai = aiFunctionNameBelow;

function aiWander(plRay) {
    var speed = 5000;
    var size = 0.1;
    console.log("aiWander for entity id " + this.id + " named " + this.name);
    console.log("pos: " + this.p.x+","+this.p.y+" angle: "+this.angle);
    // note: entity position (this.p) is changed by camera movement!
    this.p.x += Math.cos(performance.now()/speed)*size;
    //this.p.y += Math.sin(performance.now()/speed)*size;
}

function aiSeek(plRay) {
    console.log("aiSeek for entity id " + this.id + " named " + this.name);
    console.log("pos: " + this.p.x+","+this.p.y+" angle: "+this.angle);
}

function aiAvoid(plRay) {
    console.log("aiAvoid for entity id " + this.id + " named " + this.name);
    console.log("pos: " + this.p.x+","+this.p.y+" angle: "+this.angle);
}