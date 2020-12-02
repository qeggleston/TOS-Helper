
import { Engine, World, Body, Bodies, Constraint, Mouse, MouseConstraint } from 'matter-js';

var engine;
var ground, leftWall, rightWall, ceiling;
var catapult;
var constraint;
var canvas;
var mouseConstraint;
var ballObjects;
var ballIndex;
var termBalls;

//let firstOptions = true;
//let secondOptions = false;
let viz = false;
let terms;

let button1;
let button2;
//add more parameters here

let wordBubbles;

export default function sketch(p) {

    p.setup = () => {
        canvas = p.createCanvas(p.windowWidth, p.windowHeight);
            
    }
    
    p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
        if(props.terms != null) {
            terms = props.terms;
            if(!viz)
                setupViz(p);
                viz = true;
        }
    }

    p.draw = () => {
        /**if(firstOptions) {
            p.background(0);
        }
        else if(secondOptions) {
            p.background(0);
        }
        else**/ if(viz) {
            p.background(131,173,225);

            p.stroke(255);
            p.fill(255);
            drawVertices(catapult.vertices, p);
            for(let x = 0; x < ballObjects.length; x++) {
                if(termBalls[x].draw) {
                    p.stroke(249,228,219);
                    p.fill(249,228,219);
                    drawVertices(ballObjects[x].vertices, p);
                    p.stroke(0);
                    p.fill(0);
                    p.textAlign(p.CENTER);
                    p.textSize(24);
                    p.text(termBalls[x].term, ballObjects[x].position.x, ballObjects[x].position.y + 5); //make this center
                }
            }
            p.stroke(128);
            p.strokeWeight(2);

            p.noStroke();
            p.fill(128);
            drawVertices(ground.vertices, p);
            drawVertices(leftWall.vertices, p);
            drawVertices(rightWall.vertices, p);
            drawVertices(ceiling.vertices, p);

            p.stroke(0);
            p.fill(0);

            p.rect(0, 0, 50, 50);
        }
    }

    p.mousePressed = () => {
        if(p.mouseX < 50 && p.mouseX > 0 && p.mouseY < 50 && p.mouseX > 0 && ballIndex < ballObjects.length) {
            World.add(engine.world, ballObjects[ballIndex]);
            termBalls[ballIndex].draw = true;
            ballIndex++;
        }   
    }

}

/**function setupFirstOptions(p) {
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

}**/


function drawVertices(vertices, p) {
    p.beginShape();
    for (var i = 0; i < vertices.length; i++) {
        p.vertex(vertices[i].x, vertices[i].y);
    }
    p.endShape(p.CLOSE);
}

function setupViz(p) {
    //secondOptions = false;
    viz = true;
    //button2.remove();

    termBalls = [];
    ballObjects = [];

    engine = Engine.create();

    // add revolute constraint for catapult
    catapult = Bodies.rectangle(p.width/2, p.height - 200, p.width - 200, 50);
    catapult.slop = 1;
    constraint = Constraint.create({
        pointA: {x: p.width/2, y: p.height-200},
        bodyB: catapult,
        stiffness: 1,
        length: 0,
        static: true
    });
    World.add(engine.world, [catapult, constraint]);

    let xPos = 50;
    let yPos = 200;

    for(let x = 0; x < terms.length; x++) {
        termBalls[termBalls.length] = {
            term: terms[x].term,
            freq: terms[x].freq,
            ball: null,
            size: terms[x].length * 5,
            weight: terms[x].weight,
            draw: false
        };
        termBalls[termBalls.length - 1].ball = Bodies.circle(xPos, yPos, termBalls[termBalls.length - 1].size, {density: termBalls[termBalls.length - 1].freq, restitution: termBalls[termBalls.length-1].weight/10});
            //size will be lengthToSize[x], density will be freqToWeight[x], rest will be weightToRest[x]
        ballObjects[ballObjects.length] = termBalls[termBalls.length - 1].ball;

        if(xPos > p.width - 100) {
            xPos = 50;
        }
        else {
            xPos += 50;
        }
            
    }

    ballIndex = 0;

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
