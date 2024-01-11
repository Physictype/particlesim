let particle_positions = []
let particle_velocities = []
let gravity = 0.001;
let bounceIndex = 0.6;
let slideIndex = 0.8;
let objects = [];

function setup() {
    createCanvas(1000,1000);
    for (let x = 500; x < 510; x++) {
        for (let y = 100; y < 110; y++) {
            particle_positions.push(createVector(x,y));
            particle_velocities.push(createVector(0,0));
            objects.push(new PhysicsObject(createVector(x,y),createVector(0,0),new Material(0.1,0.9),false))
        }
    }
}
class Material {
    constructor(bounceCoeff,frictionCoeff,charge) {
        this.bounceCoeff = bounceCoeff;
        this.frictionCoeff = frictionCoeff;
        this.charge = charge;
    }
    bounceCoeff;
    frictionCoeff;
    charge;
}
class Collider {
    
}
class PhysicsObject {
    constructor(position,velocity,material,is_static=false) {
        this.position = position;
        this.velocity = velocity;
        this.material = material;
        // this.collider = collider;
        this.is_static = is_static;
    }
    position;
    velocity;
    collider;
    material;
    is_static;
}
class Collision {
    constructor(position,normal,collided,otherIndex) {
        this.position = position;
        this.normal = normal;
        this.collided = collided;
        this.otherIndex = otherIndex;
    }
    position;
    normal;
    collided;
    otherIndex;
}
function collide(i) {
    for (let j = 0; j < objects.length; j++) {
        if (i == j) {
            continue;
        }
        if (dist(objects[i].position.x,objects[i].position.y,objects[j].position.x,objects[j].position.y) <= 2) {
            return new Collision(objects[i].position,p5.Vector.sub(objects[i].position,objects[j].position),true,j);
        }
    }
    if (objects[i].position.y<=5) {
        return new Collision(objects[i].position,createVector(0,1),true,-1);
    }
    if (objects[i].position.y>=995) {
        return new Collision(objects[i].position,createVector(0,-1),true,-1);
    }
    if (objects[i].position.x>=995) {
        return new Collision(objects[i].position,createVector(-1,0),true,-1);
    }
    if (objects[i].position.x<=5) {
        return new Collision(objects[i].position,createVector(1,0),true,-1);
    }
    return new Collision (createVector(0,0),createVector(0,0),false,-1);
}
function updateParticle(i) {
    objects[i].velocity.y += deltaTime * gravity;

    let collision = collide(i);
    if (collision.collided) {
        let tangent = p5.Vector.rotate(collision.normal, HALF_PI);
        let tangentVec = p5.Vector.mult(tangent,objects[i].material.frictionCoeff*p5.Vector.dot(objects[i].velocity,tangent));
        let normalVec = p5.Vector.mult(collision.normal,-p5.Vector.dot(objects[i].velocity,collision.normal));
        if (collision.otherIndex != -1) {
            tangentVec.mult(objects[collision.otherIndex].material.frictionCoeff)
            objects[collision.otherIndex].velocity = p5.Vector.mult(p5.Vector.add(tangentVec,p5.Vector.mult(normalVec,objects[collision.otherIndex].material.bounceCoeff)),-1);
        }
        objects[i].velocity = p5.Vector.add(tangentVec,p5.Vector.mult(normalVec,objects[i].material.bounceCoeff));
    }
    objects[i].velocity.add();
    objects[i].position.x += deltaTime * objects[i].velocity.x;
    objects[i].position.y += deltaTime * objects[i].velocity.y;
}
function draw() {
    background(255);
    for (let i = 0; i < objects.length; i++) {
        ellipse(objects[i].position.x,objects[i].position.y,10,10);
        updateParticle(i);
    }

}