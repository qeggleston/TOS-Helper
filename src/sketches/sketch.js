
import { Engine, World, Body, Bodies, Constraint, Mouse, MouseConstraint } from 'matter-js';

var engine;
var ground, leftWall, rightWall, ceiling;
var catapult;
var constraint;
var canvas;
var mouseConstraint;

var refBalls;
var placedBalls;

//let firstOptions = true;
//let secondOptions = false;
let viz = false;
let terms;
let sel;

//let wordBubbles;

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
        if(viz) {
            p.background(131,173,225);

            p.stroke(255);
            p.fill(255);
            drawVertices(catapult.vertices, p);
            for(let x = 0; x < placedBalls.length; x++) {
                p.stroke(249,228,219);
                p.fill(249,228,219);
                drawVertices(placedBalls[x].ball.vertices, p);
                p.stroke(0);
                p.fill(0);
                p.textAlign(p.CENTER);
                p.textSize(24);
                p.text(placedBalls[x].term, placedBalls[x].ball.position.x, placedBalls[x].ball.position.y + 5); //make this center
                
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
            let index = sel.value();
            placedBalls[placedBalls.length] = JSON.parse(JSON.stringify(refBalls[index]));
            let place = placedBalls[placedBalls.length - 1];
            placedBalls[placedBalls.length - 1].ball = Bodies.circle(p.mouseX, p.mouseY, place.size, {restitution: place.restitution, mass: place.mass});

            World.add(engine.world, placedBalls[placedBalls.length-1].ball);
           
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

    viz = true;

    refBalls = [];
    placedBalls = [];

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

    sel = p.createSelect();
    sel.position(p.width - 150, 30);

    for(let x = 0; x < terms.length; x++) {
        refBalls[x] = {
            term: terms[x].term,
            mass: terms[x].freq,
            size: terms[x].length * 5,
            restitution: terms[x].weight/10,
        };
        //size will be lengthToSize[x], density will be freqToWeight[x], rest will be weightToRest[x]
        //ballObjects[ballObjects.length] = termBalls[termBalls.length - 1].ball;

        sel.option(terms[x].term, x);
            
    }
    sel.changed(selectChanged);

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

function selectChanged() {
    console.log(sel.value());
}

//draw floating word bubbles 
function drawWordBubble(p) {

}

//setup word bubbles based on 
function setupWordBubbles(p, words) {

}
