let sketchrnn;
let currentStroke;
let x,y;
let nextPen;

function preload() {
  sketchrnn = ml5.sketchRNN('cat');
}

function setup() {
  createCanvas(400, 400);
  background(220);
  x = width/2;
  y = height/2;
  sketchrnn.generate(gotStrokePath);
  console.log('model loaded');
}

function gotStrokePath(error, strokePath) {
  console.log(strokePath);
  currentStroke = strokePath;
}

function draw() {
  if (currentStroke) {
    stroke(0);
    strokeWeight(3);
    if(nextPen == 'end'){
      noLoop();
      return;
    }
    if(nextPen == 'down'){
      line(x,y, x+currentStroke.dx, y+currentStroke.dy);
    }
    x += currentStroke.dx;
    y += currentStroke.dy;
    nextPen = currentStroke.pen;
    currentStroke = null;
    sketchrnn.generate(gotStrokePath);
  }
}
