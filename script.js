let objects = []
let gravity = 0.0001;
let bounceIndex = 0.1;
let slideIndex = 0;
let max_vel = 70;
let collideStep = 1;
class Collision {
    constructor(position,normal,objIndex,collided) {
        this.position = position;
        this.normal = normal;
        this.collided = collided;
        this.objIndex = objIndex;
    }
    position;
    normal;
    collided;
    objIndex;
}
class Material {
    counstructor(bounceCoeff,frictionCoeff) {
        this.bounceCoeff=bounceCoeff;
        this.frictionCoeff=frictionCoeff;
    }
    bounceCoeff;
    frictionCoeff;
}
class PhysicalObject {
    constructor(position,velocity,material) {
        this.position=position;
        this.velocity=velocity;
        this.material=material;
    }
    position;
    velocity;
    material;
}
function setup() {
    createCanvas(1000,1000);
    for (let x = 500; x < 550; x+=10) {
        for (let y = 100; y < 150; y+=10) {
            console.log(random())
            console.log(new Material(3,5));
            console.log(new Material(random()*0.1,random()*0.1))
            objects.push(new PhysicalObject(createVector(x,y),createVector(0,0),new Material(Math.random()*0.1,Math.random()*0.1)))
        }
    }
    console.log(objects)
}
function collide(i) {
    for (let j = 0; j < objects.length; j++) {
        if (i == j) {
            continue;
        }
        if (dist(objects[i].position.x,objects[i].position.y,objects[j].position.x,objects[j].position.y) <= 20) {
            return new Collision(objects[i].position,p5.Vector.sub(objects[i].position,objects[j].position),j,true);
        }
    }
    if (objects[i].position.y<=5) {
        objects[i].position.y = 5;
        return new Collision(objects[i].position,createVector(0,-1),-1,true);
    }
    if (objects[i].position.y>=995) {
        objects[i].position.y = 995;
        return new Collision(objects[i].position,createVector(0,1),-1,true);
    }
    if (objects[i].position.x<=5) {
        objects[i].position.x = 5;
        return new Collision(objects[i].position,createVector(1,0),-1,true);
    }
    if (objects[i].position.x>=995) {
        objects[i].position.x = 995;
        return new Collision(objects[i].position,createVector(-1,0),-1,true);
    }
    return new Collision (createVector(0,0),createVector(0,0),-1,false);
}
function bounceAndSlide(i,collision) {
    let tangent = p5.Vector.rotate(collision.normal, HALF_PI);
    let tangentComponent = objects[i].velocity.dot(tangent);
    let normalComponent = objects[i].velocity.dot(collision.normal);
    let frictionCoeff = objects[i].material.frictionCoeff;
    if (collision.objIndex != -1) {
        frictionCoeff *= objects[collision.objIndex].material.frictionCoeff;
    }
    let tangentV1 = p5.Vector.mult(tangent,frictionCoeff*tangentComponent)

    let normalScaled = p5.Vector.mult(collision.normal,normalComponent);
    let normalV1 = p5.Vector.mult(normalScaled,objects[i].material.bounceCoeff);
    objects[i].velocity = p5.Vector.add(tangentV1,normalV1);

    if (collision.objIndex != -1) {
        let tangentV2 = p5.Vector.mult(tangentV1,-1);
        let normalV2 = p5.Vector.mult(normalScaled,-objects[collision.objIndex].material.bounceCoeff);
        objects[collision.objIndex].velocity = p5.Vector.add(tangentV2,normalV2);
    }
}
function updateParticle(i) {
    
    objects[i].velocity.y += deltaTime * gravity;
    let collision = collide(i);
    if (collision.collided) {
        // collision_test = collision;
        // let k = 0;
        // while (collision_test.collided && !(collision_test.normal.x==0 && collision_test.normal.y==0 && collision_test.normal.z==0) && k < 100) {
        //     objects[i].position.add(p5.Vector.mult(collision_test.normal,collideStep));
        //     collision_test = collide(i);
        //     k++;
        // }
        
        bounceAndSlide(i,collision);
    }
    objects[i].position.x += deltaTime * objects[i].velocity.x;
    objects[i].position.y += deltaTime * objects[i].velocity.y;
    if (objects[i].velocity.mag()>=max_vel) {
        objects[i].velocity.normalize();
        objects[i].velocity.mult(max_vel);
    }
    
    // if (mag(objects[i].position)<0) {
    //     objects[i].position = createVector(0,0);
    // }
}
function draw() {
    background(255);
    for (let i = 0; i < objects.length; i++) {
        ellipse(objects[i].position.x,objects[i].position.y,10,10);
        updateParticle(i);
    }
    line(450,0,450,500);
    line(550,0,550,500);
    line(450,500,550,500);
}