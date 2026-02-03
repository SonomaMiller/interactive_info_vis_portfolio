// Instance-mode sketch for tab 3: pie chart tasks
registerSketch('sk3', function (p) {
  let cx, cy, r;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(255);
    cx = p.width / 2;
    cy = p.height / 2;
    r = 220;
    p.noLoop();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(12);
    p.rectMode(p.CENTER);
  };

  function hourToAngle(hour) {
    return p.radians(hour * 15 - 90);
  }

  function slice(startHour, endHour, label, col) {
    let start = hourToAngle(startHour);
    let end = hourToAngle(endHour);

    p.fill(col);
    p.stroke(255);
    p.strokeWeight(2);
    p.arc(cx, cy, r * 2, r * 2, start, end, p.PIE);

    // label position (mid-angle)
    let mid = (start + end) / 2;
    let lx = cx + p.cos(mid) * r * 0.6;
    let ly = cy + p.sin(mid) * r * 0.6;

    p.push();
    p.translate(lx, ly);

    // rotate text to align with slice
    let angle;
    angle = mid + p.PI;
    p.rotate(angle);

    p.fill(0);
    p.noStroke();
    p.text(label, 0, 0);
    p.pop();
  }

  // add hour ticks
  function drawTicks() {
    p.push();
    p.stroke(0);
    p.strokeWeight(1);
    for (let h = 0; h < 24; h++) {
      let angle = hourToAngle(h);
      let innerR = r; // start of tick
      let outerR = r + 10; // end of tikc
      let x1 = cx + p.cos(angle) * innerR;
      let y1 = cy + p.sin(angle) * innerR;
      let x2 = cx + p.cos(angle) * outerR;
      let y2 = cy + p.sin(angle) * outerR;
      p.line(x1, y1, x2, y2);

      // hour labels
      let lx = cx + p.cos(angle) * (outerR + 10);
      let ly = cy + p.sin(angle) * (outerR + 10);
      p.push();
      p.translate(lx, ly);

      p.noStroke();
      p.fill(0);
      p.text(h, 0, 0);
      p.pop();
    }
    p.pop();
  }

  function drawClockHand() {
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();

    // time to angle (360/24 = 15 degrees per hour)
    let angle = p.radians(hours * 15 + minutes * 0.25 - 90);

    // hand length
    let handLength = r * 0.9;
    let hx = cx + p.cos(angle) * handLength;
    let hy = cy + p.sin(angle) * handLength;

    p.push();
    p.stroke('black');
    p.strokeWeight(3);
    p.line(cx, cy, hx, hy);
    p.pop();
  }

  // add tasks/activities
  p.draw = function () {
    p.background(255);

    drawTicks();

    slice(23, 24, "sleep", "pink");
    slice(0, 8, "sleep", "pink");
    slice(8, 9, "breakfast", "crimson");
    slice(9, 12, "class", "orange");
    slice(12, 13, "lunch", "gold");
    slice(13, 14.5, "class", "lightgreen");
    slice(14.5, 15.5, "workout", "green");
    slice(15.5, 18, "study", "lightblue");
    slice(18, 19.5, "dinner", "dodgerblue");
    slice(19.5, 22, "movie night", "mediumpurple");
    slice(22, 23, "get ready for bed", "lightgrey");

    drawClockHand();
  };
});
