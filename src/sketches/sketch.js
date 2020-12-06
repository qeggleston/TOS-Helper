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
let placing;
let terms;
let sel;
let legendText;

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
            p.textSize(24);
            p.textAlign(p.LEFT);
            p.text(legendText, 50, 50);

        }
    }

    p.mousePressed = () => {
            if(!(p.mouseY < 60) && placing) {
                let index = sel.value();
                placedBalls[placedBalls.length] = JSON.parse(JSON.stringify(refBalls[index]));
                let place = placedBalls[placedBalls.length - 1];
                placedBalls[placedBalls.length - 1].ball = Bodies.rectangle(p.mouseX, p.mouseY, place.size*2, place.size*2, {friction: 1, restitution: place.restitution, mass: place.mass});

                World.add(engine.world, placedBalls[placedBalls.length-1].ball);
            }
           
    }

}

function drawVertices(vertices, p) {
    p.beginShape();
    for (var i = 0; i < vertices.length; i++) {
        p.vertex(vertices[i].x, vertices[i].y);
    }
    p.endShape(p.CLOSE);
}

function togglePlacing() {
    placing = !placing;
}

function updateLegendText() {
    let index = sel.value();
    legendText = "Legend\n\nWord: " +refBalls[index].term + "\nWord Frequency & Mass: " + refBalls[index].mass + "\nWord Length: " +
        refBalls[index].term.length + " characters\nCircle Size (Length * 5): " + refBalls[index].size + "\nTF-IDF Weight: " + refBalls[index].restitution*10 +
        "\nRestitution (Bounciness, TF-IDF Weight/10): " + refBalls[index].restitution;
}

function setupViz(p) {

    viz = true;
    placing = false;
    let placingCheckbox = p.createCheckbox('Placing Circles', false);
    placingCheckbox.position(p.width-300, 30);
    placingCheckbox.changed(togglePlacing)

    refBalls = [];
    placedBalls = [];

    engine = Engine.create();

    // add revolute constraint for catapult
    catapult = Bodies.rectangle(p.width/2, p.height - 200, p.width - 200, 50, {friction: 1});
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
            
    }

    sel.changed(updateLegendText);

    refBalls.sort(compareTerms);
    legendText = "Legend\n\nWord: " +refBalls[0].term + "\nWord Frequency & Mass: " + refBalls[0].mass + "\nWord Length: " +
                 refBalls[0].term.length + " characters\nCircle Size (Length * 5): " + refBalls[0].size + "\nTF-IDF Weight: " + refBalls[0].restitution*10 +
                 "\nRestitution (Bounciness, TF-IDF Weight/10): " + refBalls[0].restitution;

    for(let x = 0; x < refBalls.length; x++) {
        sel.option(refBalls[x].term, x);
    }
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

function compareTerms(a, b) {
    return a.term.localeCompare(b.term);
}
//draw floating word bubbles 
function drawWordBubble(p) {

}

//setup word bubbles based on 
function setupWordBubbles(p, words) {

}
