// Instance-mode sketch for tab 4: bomb timer
registerSketch('sk4', function (p) {
  let minutesInput, secondsInput;
  let startButton, pauseButton, restartButton;

  let totalSeconds = 0;
  let remainingSeconds = 0;
  let running = false;
  let lastMillis = 0;
  let exploded = false;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(32);

    // user imput fields
    minutesInput = p.createInput('');
    minutesInput.attribute('placeholder', 'minutes');
    minutesInput.position(100, 300);
    minutesInput.size(50);

    secondsInput = p.createInput('');
    secondsInput.attribute('placeholder', 'seconds');
    secondsInput.position(250, 300);
    secondsInput.size(50);

    // Buttons :3
    startButton = p.createButton('Start');
    startButton.position(100, 340);
    startButton.mousePressed(startTimer);

    pauseButton = p.createButton('Pause');
    pauseButton.position(175, 340);
    pauseButton.mousePressed(pauseTimer);

    restartButton = p.createButton('Restart');
    restartButton.position(250, 340);
    restartButton.mousePressed(restartTimer);
  };

  function startTimer() {
    if (!running) {
      // if first time, read input values
      if (remainingSeconds <= 0) {
        let mins = parseInt(minutesInput.value()) || 0;
        let secs = parseInt(secondsInput.value()) || 0;
        totalSeconds = mins * 60 + secs;
        remainingSeconds = totalSeconds;
        exploded = false;
      }
      running = true;
      lastMillis = p.millis();
    }
  }

  function pauseTimer() {
    running = false;
  }

  function restartTimer() {
    running = false;
    exploded = false;
    remainingSeconds = totalSeconds;
  }

  function drawBomb(x, y, size) {
    p.push();
    p.translate(x, y);

    // bomb body
    p.noStroke();
    p.fill("dimgray");
    p.circle(0, 0, size);

    // cap thing
    let capWidth = size * 0.35;
    let capHeight = size * 0.2;
    p.rectMode(p.CENTER);
    p.rect(0, -size / 2 - capHeight / 2, capWidth, capHeight, 4);

    // Wick
    let wickFullHeight = size * 0.25;
    let wickWidth = size * 0.05;
    let fraction = totalSeconds > 0 ? remainingSeconds / totalSeconds : 0; // 1 → 0
    let wickHeight = wickFullHeight * fraction;
    let wickTopY = -size / 2 - capHeight - wickHeight / 2;

    p.fill("tan");

    p.rect(0, wickTopY, wickWidth, wickHeight);

    // fuse on wick
    if (remainingSeconds > 0) {
      let dotY = wickTopY - wickHeight / 2;
      p.fill('red');
      p.noStroke();
      p.circle(0, dotY, wickWidth);
    }

    p.pop();
  }

  function drawExplosion() {
    p.push();
    p.translate(p.width / 2, p.height / 2);
    let numRays = 60;
    let maxRadius = p.width * 0.8;
    for (let i = 0; i < numRays; i++) {
      let angle = (p.TWO_PI / numRays) * i;
      let rayLength = maxRadius * p.random(0.7, 1);
      let col;
      if (i % 3 === 0) col = 'red';
      else if (i % 3 === 1) col = 'orange';
      else col = 'yellow';
      p.stroke(col);
      p.strokeWeight(4);
      p.line(0, 0, p.cos(angle) * rayLength, p.sin(angle) * rayLength);
    }
    p.pop();
  }

  p.draw = function () {
    p.background(240);

    // Update if running
    if (running && remainingSeconds > 0) {
      let now = p.millis();
      let delta = now - lastMillis;
      if (delta >= 1000) {
        remainingSeconds -= Math.floor(delta / 1000);
        lastMillis = now;
        if (remainingSeconds < 0) remainingSeconds = 0;
      }
    }

    // Check if exploded
    if (totalSeconds > 0 && remainingSeconds <= 0 && !exploded) {
      exploded = true;
    }

    // Draw explosion if exploded
    if (exploded) {
      drawExplosion();
    } else {
      // Draw bomb normally
      let bombSize = 150;
      drawBomb(p.width / 2, p.height / 2, bombSize);
    }

    // Display timer on top of bomb/explosion
    let displayMins = Math.floor(remainingSeconds / 60);
    let displaySecs = remainingSeconds % 60;
    let timeStr = p.nf(displayMins, 2) + ':' + p.nf(displaySecs, 2);
    p.fill("white");
    p.textSize(32);
    p.text(timeStr, p.width / 2, p.height / 2);
  };

    p.windowResized = function () {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
});
