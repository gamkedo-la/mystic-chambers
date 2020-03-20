// entity AI functions
// an optional callback used by entities
// to enable, pass it via the set function:
// myEnemy.set(x,y,id,aiFunction); // see entity.js

function FireskullAI() {
    console.log("Fireskull AI running...");
    this.p.x += Math.cos(performance.now()/1000)*0.25;
    this.p.y += Math.sin(performance.now()/1333)*0.25;
    this.angle += 1;
}

function patrolAI() {
}

function HealthpackAI() {
}