
import { Engine, World, Body, Bodies, Constraint, Mouse, MouseConstraint } from 'matter-js';

var engine;
var ground, leftWall, rightWall, ceiling;
var catapult;
var constraint;
var canvas;
var mouseConstraint;
var ballObjects;

let firstOptions = true;
let secondOptions = false;
let viz = false;
let document;

let button1;
let button2;

export default function sketch(p) {

    p.setup = () => {
        canvas = p.createCanvas(p.windowWidth, p.windowHeight);        
        setupFirstOptions(p);
    }
    
    p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
        if(props.document != null) {
            document = props.document;
            console.log(document);
        }
    }

    p.draw = () => {
        if(firstOptions) {
            p.background(0);
        }
        else if(secondOptions) {
            p.background(0);
        }
        else if(viz) {
            p.background(0);

            p.stroke(255);
            p.fill(255);
            drawVertices(catapult.vertices, p);
            for(let x = 0; x < ballObjects.length; x++) {
                drawVertices(ballObjects[x].vertices, p);
            }
            p.stroke(128);
            p.strokeWeight(2);
            drawConstraint(constraint, p);

            p.noStroke();
            p.fill(128);
            drawVertices(ground.vertices, p);
            drawVertices(leftWall.vertices, p);
            drawVertices(rightWall.vertices, p);
            drawVertices(ceiling.vertices, p);

            drawMouse(mouseConstraint, p);

            p.stroke(0);
            p.fill(0);
        }
    }

}

function setupFirstOptions(p) {
    button1 = p.createButton('click me 1');
    button1.position(p.width/2, p.height/2);
    button1.mousePressed(() => setupSecondOptions(p));

}

function setupSecondOptions(p) {
    firstOptions = false;
    secondOptions = true;
    button1.remove();
    button2 = p.createButton('click me 2');
    button2.position(p.width/2, p.height/2);
    button2.mousePressed(() => setupViz(p));

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

function setupViz(p) {
    secondOptions = false;
    viz = true;
    button2.remove();

    let uniqueTerms = document.getUniqueTerms();
    console.log(uniqueTerms);
    let termBalls = [];
    ballObjects = [];

    // create an engine
    engine = Engine.create();

    // add revolute constraint for catapult
    catapult = Bodies.rectangle(p.width/2, p.height - 200, p.width - 200, 50);
    constraint = Constraint.create({
        pointA: {x: p.width/2, y: p.height-200},
        bodyB: catapult,
        stiffness: 1,
        length: 0
    });
    World.add(engine.world, [catapult, constraint]);

    let xPos = 50;
    let yPos = 50;

    for(let x = 0; x < uniqueTerms.length; x++) {
        if(uniqueTerms[x].length > 11) {
            termBalls[x] = {
                term: uniqueTerms[x],
                freq: document.getTermFrequency(uniqueTerms[x]),
                ball: null
            };
            termBalls[x].ball = Bodies.circle(xPos, yPos, 20, {density: termBalls[x].freq/10, restitution: 0.5});
            ballObjects[ballObjects.length] = termBalls[x].ball;

            if(xPos > p.width - 100) {
                xPos = 50;
                yPos += 50;
            }
            else {
                xPos += 50;
            }
            
        }
    }

    console.log(ballObjects);
    World.add(engine.world, ballObjects);

    // walls 
    rightWall = Bodies.rectangle(p.width - 10, p.height/2, 25, p.height, {isStatic: true});
    leftWall = Bodies.rectangle(10, p.height/2, 25, p.height, {isStatic: true});
    ceiling = Bodies.rectangle(p.width/2, 10, p.width, 25, {isStatic: true});
    ground = Bodies.rectangle(p.width/2, p.height-10, p.width, 25, {isStatic: true});
    World.add(engine.world, [ground, leftWall, rightWall, ceiling]);

    // setup mouse
    var mouse = Mouse.create(canvas.elt);
    var mouseParams = {
        mouse: mouse,
        constraint: { stiffness: 1 }
    }
    mouseConstraint = MouseConstraint.create(engine, mouseParams);
    mouseConstraint.mouse.pixelRatio = p.pixelDensity();
    World.add(engine.world, mouseConstraint);

    // run the engine
    Engine.run(engine);
}

//draw floating word bubbles 
function drawWordBubble(p) {

}

//setup word bubbles based on 
function setupWordBubbles(p, words) {

}
