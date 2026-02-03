// Instance-mode sketch for tab 2: spiral clock
registerSketch('sk2', function (p) {
  // const spiralclock = (p) => {
  let angle = 0; // starting angle
  let radius = 0; // radius of the circle motion
  let pixelsPerRotation = 10; //increase the radius
  let totalFrames = 0; // Tracks active duration

  let previousX; // declared previous x position variable
  let previousY; // declared previous y position variable

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(255);
    p.textAlign(p.CENTER);
    p.textSize(24);
    p.rectMode(p.CENTER);
  };

  p.draw = function () {
    // calculate the x and y coordinates of the circle
    let x = p.width / 2 + p.cos(angle) * radius;
    let y = p.height / 2 + p.sin(angle) * radius;

    // increase the angle to create motion; 1 rotation every 60 seconds
    let dAngle = (p.TWO_PI / 10) * (p.deltaTime / 1000); // 1 rotation per 10s
    angle += dAngle;

    // increase the radius to make it grow as spiral
    radius += pixelsPerRotation * (dAngle / p.TWO_PI);

    // update total frames
    totalFrames++;

    // draw the circle
    p.stroke(0);
    p.strokeWeight(2);
    if (typeof previousX !== 'undefined' && typeof previousY !== 'undefined') {
      p.line(x, y, previousX, previousY);  //throws a wild error in the first loop, but work from the second loop :D
    }

    // save current position as previous position
    previousX = x;
    previousY = y;

    // calculate minutes and seconds based on 60fps
    let totalSeconds = p.floor(totalFrames / 60);
    let minutes = p.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    // format string to add leading zero to seconds (e.g., 01:05)
    let timeString = minutes + ":" + p.nf(seconds, 2);

    p.push();
    // draw a small white rectangle behind text to keep it readable
    // erase numbers right before drawing new ones
    p.noStroke();
    p.fill(255);
    p.rectMode(p.CENTER);
    p.rect(p.width / 2, p.height - 50, 150, 50);

    p.fill(0);
    p.text(timeString, p.width / 2, p.height - 50);
    p.pop();
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});
