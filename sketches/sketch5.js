// Homework 5: Uber destination bar chart
registerSketch('sk5', function (p) {
  let table;
  let isPickupMode = true;
  let bestData = [];
  let worstData = [];
  let topReasons = [];

  p.preload = () => {
    table = p.loadTable("ncr_ride_bookings.csv", "csv", "header");
  };

  p.setup = () => {
    let canvasHeight = p.max(p.windowHeight, 800);
    p.createCanvas(p.windowWidth, canvasHeight);
    processRideData();
    p.noLoop();
  };

  function processRideData() {
    let stats = {};
    let reasonCounts = {};
    let rows = table.getRows();
    let allLocations = [];

    let colIndex = isPickupMode ? 6 : 7;

    for (let i = 0; i < rows.length; i++) {
      let loc = rows[i].getString(colIndex);
      let custCancel = rows[i].getString(10) === "1" ? 1 : 0;
      let drivCancel = rows[i].getString(12) === "1" ? 1 : 0;

      // reasons for cancellation
      let custReason = rows[i].getString(11);
      let drivReason = rows[i].getString(13);

      if (!stats[loc]) {
        stats[loc] = { cancelled: 0, total: 0 };
      }

      stats[loc].total++;
      if (custCancel === 1 || drivCancel === 1) {
        stats[loc].cancelled++;

        [custReason, drivReason].forEach(r => {
          if (r && r !== "null" && r !== "") {
            reasonCounts[r] = (reasonCounts[r] || 0) + 1;
          }
        });
      }
    }

    for (let loc in stats) {
      let proportion = stats[loc].cancelled / stats[loc].total;
      allLocations.push({
        name: loc,
        ratio: proportion,
        cancelled: stats[loc].cancelled,
        total: stats[loc].total
      });
    }

    // Sort from highest to lowest
    allLocations.sort((a, b) => b.ratio - a.ratio);

    worstData = allLocations.slice(0, 5);
    bestData = allLocations.slice(-5);
    bestData.reverse();

    topReasons = Object.entries(reasonCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);
  }

  p.draw = () => {
    p.background("white");
    p.rectMode(p.CORNER);

    // draw toggle switch
    p.noStroke();
    p.fill("lightgray");
    p.rect(20, 20, 110, 30, 15);

    // Sliding Knob
    p.fill(isPickupMode ? p.color(50, 100, 250) : p.color(250, 50, 50));
    let knobX = isPickupMode ? 22 : 82;
    p.rect(knobX, 22, 56, 26, 13);

    // switch text
    p.fill(255);
    p.textSize(10);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(isPickupMode ? "Pickup" : "Dropoff", knobX + 28, 35);

    p.fill(100);
    p.textAlign(p.LEFT);
    p.text(isPickupMode ? "Dropoff" : "Pickup", isPickupMode ? 90 : 30, 35);

    p.textAlign(p.CENTER, p.CENTER);
    p.fill('black');
    p.textSize(20);
    p.textStyle(p.BOLD);
    p.text('Best and Worst Uber Destinations in India', p.width / 2, 50);

    p.textStyle(p.NORMAL);
    p.textAlign(p.CENTER, p.CENTER);
    p.fill('gray');
    p.textSize(15);
    p.text('According to Proportion of Cancelled Rides', p.width / 2, 75);

    if (bestData.length === 0 || worstData.length === 0) {
      p.text("Processing data...", p.width / 2, p.height / 2);
      return;
    }

    const centerX = p.width / 2;
    const barHeight = 40;
    const spacing = 30;
    const maxBarWidth = 400;

    // Auto-scale bar width
    let maxRatio = p.max([...worstData, ...bestData].map(d => d.ratio)) || 0.1;

    for (let i = 0; i < 5; i++) {
      let y = 140 + i * (barHeight + spacing);

      // left blue bars
      if (bestData[i]) {
        let wLeft = p.map(bestData[i].ratio, 0, maxRatio, 5, maxBarWidth);
        let percLeft = p.nf(bestData[i].ratio * 100, 1, 1) + "%";
        let fractionLeft = `${bestData[i].cancelled}/${bestData[i].total}`;

        p.fill("skyblue");
        p.noStroke();
        p.rect(centerX - wLeft, y, wLeft, barHeight);

        // name of location outside bar
        p.textAlign(p.RIGHT, p.CENTER);
        p.fill('black');
        p.textSize(11);
        p.text(bestData[i].name, centerX - wLeft - 10, y + barHeight / 2);

        // percentage inside bar
        p.textAlign(p.LEFT, p.CENTER);
        p.fill('white');
        p.text(percLeft + " (" + fractionLeft + ")", centerX - wLeft + 5, y + barHeight / 2);
      }

      // right red bars
      if (worstData[i]) {
        let wRight = p.map(worstData[i].ratio, 0, maxRatio, 5, maxBarWidth);
        let percRight = p.nf(worstData[i].ratio * 100, 1, 1) + "%";
        let fractionRight = `${worstData[i].cancelled}/${worstData[i].total}`;

        p.fill("crimson");
        p.noStroke();
        p.rect(centerX, y, wRight, barHeight);

        // name outside bar
        p.textAlign(p.LEFT, p.CENTER);
        p.fill('black');
        p.textSize(11);
        p.text(worstData[i].name, centerX + wRight + 10, y + barHeight / 2);

        // percentage inside bar
        p.textAlign(p.RIGHT, p.CENTER);
        p.fill('white');
        p.text(percRight + " (" + fractionRight + ")", centerX + wRight - 5, y + barHeight / 2);      }
    }

    // Center Vertical Axis
    p.stroke(150);
    p.strokeWeight(2);
    p.line(centerX, 120, centerX, 500);

    // top reasons
    let boxY = 540;
    let boxW = 300;

    p.noFill();
    p.stroke('lightgray');
    p.strokeWeight(1);
    p.rect(centerX - boxW / 2, boxY, boxW, 110, 10);

    p.noStroke();
    p.fill('black');
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(14);
    p.textStyle(p.BOLD);
    p.text("Top Reasons for Cancellation:", centerX, boxY + 15);

    p.textStyle(p.NORMAL);
    p.textSize(12);
    p.fill('black');
    for (let i = 0; i < topReasons.length; i++) {
      p.text(`${i + 1}. ${topReasons[i]}`, centerX, boxY + 45 + (i * 18));
    }
  };

  // handle tab switching/toggle clicks
  p.mousePressed = () => {
    if (p.mouseX > 20 && p.mouseX < 130 && p.mouseY > 20 && p.mouseY < 50) {
      isPickupMode = !isPickupMode;
      processRideData();
      p.redraw();
    }
  };
});