
let w = window.innerWidth;
let h = window.innerHeight;
let sketchRNN;
let currentStroke;
let x, y;
let nextPen = 'down';
let seedPath = [];
let seedPoints = [];
let personDrawing = false;
let button;

function preload() {
  sketchRNN = ml5.sketchRNN('cat');
}

function startDrawing() {
  x = mouseX;
  y = mouseY;
  personDrawing = true;
}

function sketchRNNstart() {
  personDrawing = false;

  // Perform RDP Line Simplification
  const rdpPoints = [];
  const total = seedPoints.length;
  const start = seedPoints[0];
  const end = seedPoints[total-1];
  rdpPoints.push(start);
  rdp(0, total-1, seedPoints, rdpPoints);
  rdpPoints.push(end);
  
  // Drawing simplified path
  background(0);
  stroke(255);
  strokeWeight(4);
  beginShape();
  noFill();
  for (let v of rdpPoints) {
    vertex(v.x, v.y); 
  }
  endShape();
  
  x = rdpPoints[rdpPoints.length-1].x;
  y = rdpPoints[rdpPoints.length-1].y;
  
  
  seedPath = [];
  // Converting to SketchRNN states
  for (let i = 1; i < rdpPoints.length; i++) {
    let strokePath = {
      dx: rdpPoints[i].x - rdpPoints[i-1].x,
      dy: rdpPoints[i].y - rdpPoints[i-1].y,
      pen: 'down'
    }
    //line(x, y, x + strokePath.dx, y + strokePath.dy);
    //x += strokePath.dx;
    //y += strokePath.dy;
    seedPath.push(strokePath);
  }
  sketchRNN.generate(seedPath, gotStrokePath);
}
// SETUP
function setup() {
  let canvas = createCanvas(w, h);
  canvas.mousePressed(startDrawing);
  canvas.mouseReleased(sketchRNNstart);
  background(0);
  // x = width/2;
  // y = height/2;
  // sketchrnn.generate(gotStrokePath);
  console.log('model loaded');

  button = createButton('restart');
  button.position(19, 19);
  button.mousePressed(reStart);

  fill(255);
  textAlign(CENTER);
  text("START DRAWING ONE CAT STROKE...", 250, 60);
}

function gotStrokePath(error, strokePath) {
  console.log(strokePath);
  currentStroke = strokePath;
}

function reStart() {
  background(0);
  // sketchRNN.reset();
  // gotStrokePath = [];
  // currentStroke = null;
  // nextPen = 'down';
  // return;
  // sketchRNNstart();
  window.location.reload();
}
// DRAW
function draw() {
  if (personDrawing) {
    // let strokePath = {
    //   dx: mouseX - pmouseX,
    //   dy: mouseY - pmouseY,
    //   pen: 'down',
    // }
    // stroke(0);
    // strokeWeight(3);
    // line(x, y, x + strokePath.dx, y + strokePath.dy)
    // x += strokePath.dx;
    // y += strokePath.dy;
    // seedPath.push(strokePath)
    stroke(255);
    strokeWeight(4);
    line(mouseX, mouseY, pmouseX, pmouseY)
    seedPoints.push(createVector(mouseX, mouseY));
  }

  if (currentStroke) {

    if (nextPen == 'end') {
      noLoop();
      return;
      // sketchRNN.reset();
      // sketchRNNStart();
      // currentStroke = null;
      // nextPen = 'down';
      // return;
    }
    if (nextPen == 'down') {
      line(x, y, x + currentStroke.dx, y + currentStroke.dy);
    }
    x += currentStroke.dx;
    y += currentStroke.dy;
    nextPen = currentStroke.pen;
    currentStroke = null;
    sketchRNN.generate(gotStrokePath);
  }
}
