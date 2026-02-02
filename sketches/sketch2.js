// Instance-mode sketch for tab 2: spiral clock
registerSketch('spiralclock', function (p) {
// const spiralclock = (p) => {
  let angle = 0; // starting angle
  let radius = 0; // radius of the circle motion
  let spd = 0.005; // speed of the motion
  let radiusUp = 0.05; //increase the radius

  let previousX; // declared previous x position variable
  let previousY; // declared previous y position variable

  p.setup = function () {
    createCanvas(400, 400);
    background(255);
    rectMode(CENTER);
  };

  p.draw = function () {
    // calculate the x and y coordinates of the circle
    let x = width / 2 + cos(angle) * radius;
    let y = height / 2 + sin(angle) * radius;

    // increase the angle to create motion
    angle += spd;

    // increase the radius to make it grow as spiral
    radius += radiusUp;

    // draw the circle
    stroke(0);
    strokeWeight(2);
    line(x, y, previousX, previousY); //throws a wild error in the first loop, but work from the second loop :D

    // save current position as previous position
    previousX = x;
    previousY = y;
  };

  p.windowResized = function() { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});

// let myp5 = new p5(spiralclock, 'sk2');
