let particle_positions = []
let particle_velocities = []
let gravity = 0.001;
let bounceIndex = 0.6;
let slideIndex = 0.8;

function setup() {
    createCanvas(1000,1000);
    for (let x = 500; x < 510; x++) {
        for (let y = 100; y < 110; y++) {
            particle_positions.push(createVector(x,y));
            particle_velocities.push(createVector(0,0));
        }
    }
}
class Collision {
    constructor(position,normal,collided) {
        this.position = position;
        this.normal = normal;
        this.collided = collided;
    }
    position;
    normal;
    collided;
}
function collide(i) {
    for (let j = 0; j < particle_positions.length; j++) {
        if (i == j) {
            continue;
        }
        if (dist(particle_positions[i].x,particle_positions[i].y,particle_positions[j].x,particle_positions[j].y) <= 2) {
            return new Collision(particle_positions[i],p5.Vector.sub(particle_positions[i],particle_positions[j]),true);
        }
    }
    if (particle_positions[i].y>=500) {
        return new Collision(particle_positions[i],createVector(0,1),true);
    }
    return new Collision (createVector(0,0),createVector(0,0),false);
}
function updateParticle(i) {
    particle_velocities[i].y += deltaTime * gravity;
    
    let collision = collide(i);
    if (collision.collided) {
        let tangent = p5.Vector.rotate(collision.normal, HALF_PI);
        let tangentVec = p5.Vector.mult(tangent,slideIndex*p5.Vector.dot(particle_velocities[i],tangent));
        let normalVec = p5.Vector.mult(collision.normal,-bounceIndex*p5.Vector.dot(particle_velocities[i],collision.normal));
        particle_velocities[i] = p5.Vector.add(tangentVec,normalVec);
        
    }
    particle_positions[i].x += deltaTime * particle_velocities[i].x;
    particle_positions[i].y += deltaTime * particle_velocities[i].y;
}
function draw() {
    background(255);
    for (let i = 0; i < particle_positions.length; i++) {
        ellipse(particle_positions[i].x,particle_positions[i].y,10,10);
        updateParticle(i);
    }

}