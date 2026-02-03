// Instance-mode sketch for tab 4: bomb timer
registerSketch('sk4', function (p) {
  let minutesInput, secondsInput;
  let startButton, pauseButton, restartButton;

  let totalSeconds = 0;
  let remainingSeconds = 0;
  let running = false;
  let lastMillis = 0;

  p.setup = function () {
    p.createCanvas(400, 200);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(32);

    // user imput fields
    minutesInput = p.createInput('');
    minutesInput.attribute('placeholder', 'minutes');
    minutesInput.position(50, 150);
    minutesInput.size(50);

    secondsInput = p.createInput('0');
    secondsInput.attribute('placeholder', 'seconds');
    secondsInput.position(150, 150);
    secondsInput.size(50);

    // Buttons :3
    startButton = p.createButton('Start');
    startButton.position(250, 140);
    startButton.mousePressed(startTimer);

    pauseButton = p.createButton('Pause');
    pauseButton.position(250, 170);
    pauseButton.mousePressed(pauseTimer);

    restartButton = p.createButton('Restart');
    restartButton.position(320, 140);
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
    remainingSeconds = totalSeconds;
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

    // display
    let displayMins = Math.floor(remainingSeconds / 60);
    let displaySecs = remainingSeconds % 60;
    let timeStr = p.nf(displayMins, 2) + ':' + p.nf(displaySecs, 2);
    p.fill(0);
    p.text(timeStr, p.width / 2, p.height / 2);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
});
