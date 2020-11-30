
import { Engine, World, Body, Bodies, Constraint, Mouse, MouseConstraint } from 'matter-js';

var engine;
var ground;
var ball1;
var ball2;
var catapult;
var catapultSpacer;
var constraint;
var canvas;
var mouseConstraint;

export default function sketch(p) {

    p.setup = () => {
        canvas = p.createCanvas(800, 600);

        // create an engine
        engine = Engine.create();

        // add revolute constraint for catapult
        catapult = Bodies.rectangle(400, 520, 600, 20);
        constraint = Constraint.create({
            pointA: {x: 400, y: 520},
            bodyB: catapult,
            stiffness: 1,
            length: 0
        });
        World.add(engine.world, [catapult, constraint]);

        // balls and catapult spacer for limit
        catapultSpacer = Bodies.rectangle(150, 555, 20, 50, {isStatic: true });
        ball1 = Bodies.circle(560, 100, 50, {density: 0.01}); // make big one more 'heavy'
        ball2 = Bodies.circle(110, 480, 20);
        World.add(engine.world, [catapultSpacer, ball1, ball2]);

        // ground
        ground = Bodies.rectangle(400, p.height-10, 810, 25, {isStatic: true});
        World.add(engine.world, [ground]);

        // setup mouse
        var mouse = Mouse.create(canvas.elt);
        var mouseParams = {
            mouse: mouse,
            constraint: { stiffness: 0.05 }
        }
        mouseConstraint = MouseConstraint.create(engine, mouseParams);
        mouseConstraint.mouse.pixelRatio = p.pixelDensity();
        World.add(engine.world, mouseConstraint);

        // run the engine
        Engine.run(engine);
    }

    p.draw = () => {
        p.background(0);

        p.stroke(255);
        p.fill(255);
        drawVertices(catapult.vertices, p);
        drawVertices(catapultSpacer.vertices, p);
        drawVertices(ball1.vertices, p);
        drawVertices(ball2.vertices, p);
        p.stroke(128);
        p.strokeWeight(2);
        drawConstraint(constraint, p);

        p.noStroke();
        p.fill(128);
        drawVertices(ground.vertices, p);

        drawMouse(mouseConstraint, p);
        }

}

function drawConstraint(constraint, p) {
    var offsetA = constraint.pointA;
    var posA = {x:0, y:0};
    if (constraint.bodyA) {
        posA = constraint.bodyA.position;
    }
    var offsetB = constraint.pointB;
    var posB = {x:0, y:0};
    if (constraint.bodyB) {
        posB = constraint.bodyB.position;
    }
    p.line(
        posA.x + offsetA.x,
        posA.y + offsetA.y,
        posB.x + offsetB.x,
        posB.y + offsetB.y
    );
}

function drawMouse(mouseConstraint, p) {
    if (mouseConstraint.body) {
        var pos = mouseConstraint.body.position;
        var offset = mouseConstraint.constraint.pointB;
        var m = mouseConstraint.mouse.position;
        p.stroke(0, 255, 0);
        p.strokeWeight(2);
        p.line(pos.x + offset.x, pos.y + offset.y, m.x, m.y);
    }
}

function drawVertices(vertices, p) {
    p.beginShape();
    for (var i = 0; i < vertices.length; i++) {
        p.vertex(vertices[i].x, vertices[i].y);
    }
    p.endShape(p.CLOSE);
}