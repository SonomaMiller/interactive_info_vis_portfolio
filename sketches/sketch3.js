// Instance-mode sketch for tab 3: pie chart tasks
registerSketch('sk3', function (p) {
  let cx, cy, r;

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background("white");
    cx = p.width / 2; // da math for circle stuff
    cy = p.height / 2;
    r = 220;
    p.textAlign(p.CENTER);
    p.textSize(13);
    p.rectMode(p.CENTER);
  };

  function hourToAngle(hour) {
    return p.radians(hour * 15 - 90);
  }

  function slice(startHour, endHour, label, col) {
    let start = hourToAngle(startHour);
    let end = hourToAngle(endHour);
    let nowDate = new Date();
    let now = nowDate.getHours() + nowDate.getMinutes() / 60;
    let sliceEnded;

    // if activity is fully in the past grey out
    if (startHour < endHour) {
      sliceEnded = now >= endHour;
    } else {
      sliceEnded = now >= endHour && now < startHour;
    }
    let c = sliceEnded ? p.color('#F0F0F0') : p.color(col);

    p.fill(c);
    p.stroke(255);
    p.strokeWeight(2);
    p.arc(cx, cy, r * 2, r * 2, start, end, p.PIE);

    // label position
    let mid = (start + end) / 2;
    let lx = cx + p.cos(mid) * r * 0.6;
    let ly = cy + p.sin(mid) * r * 0.6;

    p.push();
    p.translate(lx, ly);

    // rotate text to align with slice
    let angle = mid;
    if (angle > p.HALF_PI && angle < 1.5 * p.PI) {
      angle += p.PI;
    }
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

    let now = new Date();
    let nowHour = now.getHours() === 0 ? 24 : now.getHours();

    for (let h = 0; h < 24; h++) {
      p.push();

      let angle = hourToAngle(h);
      let displayHour = h === 0 ? 24 : h;

      // bold only current hour tick
      p.strokeWeight(displayHour === nowHour ? 3 : 1);
      // bold current hour number
      if (displayHour === nowHour) {
        p.textStyle(p.BOLD);
      } else {
        p.textStyle(p.NORMAL);
      }


      let innerR = r;
      let outerR = r + 10;

      let x1 = cx + p.cos(angle) * innerR;
      let y1 = cy + p.sin(angle) * innerR;
      let x2 = cx + p.cos(angle) * outerR;
      let y2 = cy + p.sin(angle) * outerR;

      p.line(x1, y1, x2, y2);

      // hour label
      let lx = cx + p.cos(angle) * (outerR + 14);
      let ly = cy + p.sin(angle) * (outerR + 14);

      p.noStroke();
      p.fill(0);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(displayHour, lx, ly);
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
    p.background("white");
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
    slice(22, 23, "bedtime", "lightgrey");

    drawClockHand();
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.background("white");
    p.redraw();
  };
});
