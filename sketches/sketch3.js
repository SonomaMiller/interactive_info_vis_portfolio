// Instance-mode sketch for tab 3: pie chart tasks
registerSketch('sk3', function (p) {
  let cx, cy, r;

  p.setup = function () {
    p.createCanvas(600, 600);
    cx = p.width / 2;
    cy = p.height / 2;
    r = 220;
    p.noLoop();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(12);
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

  // add tasks/activities
  p.draw = function () {
    p.background(255);

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
  };
});
