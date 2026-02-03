// Instance-mode sketch for tab 2: spiral clock
registerSketch('sk2', function (p) {
  // const spiralclock = (p) => {
  let startTime = 0; // start time in milliseconds

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(255);
    p.textAlign(p.CENTER);
    p.textSize(24);
    p.rectMode(p.CENTER);
  };

  p.draw = function () {
    // clear frame
    p.background(255);

    // time since start (seconds)
    let tNow = (p.millis() - startTime) / 1000;

    // spiral controls
    let secondsPerRotation = 10;
    let pixelsPerRotation = 8;

    // how finely to sample the spiral
    let step = 0.02; // seconds per segment (smaller = smoother)

    let cx = p.width / 2;
    let cy = p.height / 2;

    p.stroke(0);
    p.strokeWeight(2);
    p.noFill();

    let prevX, prevY;

    for (let t = 0; t <= tNow; t += step) {
      let angle = p.TWO_PI * (t / secondsPerRotation);
      let radius = pixelsPerRotation * (angle / p.TWO_PI);

      let x = cx + p.cos(angle) * radius;
      let y = cy + p.sin(angle) * radius;

      if (prevX !== undefined) {
        p.line(prevX, prevY, x, y);
      }

      prevX = x;
      prevY = y;
    }

    // timer text (MM:SS)
    let totalSeconds = p.floor(tNow);
    let minutes = p.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    p.noStroke();
    p.fill(255);
    p.rect(cx, p.height - 50, 150, 50);
    p.fill(0);
    p.text(minutes + ":" + p.nf(seconds, 2), cx, p.height - 50);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});
