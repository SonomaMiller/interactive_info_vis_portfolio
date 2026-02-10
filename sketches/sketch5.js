// Homework 5: Uber destination bar chart
registerSketch('sk5', function (p) {
  let table;
  let isPickupMode = true;
  let bestData = [];
  let worstData = [];

  p.preload = () => {
    table = p.loadTable("ncr_ride_bookings.csv", "csv", "header");
  };

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    processRideData();
    p.noLoop();
  };

  function processRideData() {
    let stats = {};
    let rows = table.getRows();
    let allLocations = [];

    let colIndex = isPickupMode ? 6 : 7;

    for (let i = 0; i < rows.length; i++) {
      let loc = rows[i].getString(colIndex);
      let custCancel = rows[i].getString(10) === "1" ? 1 : 0;
      let drivCancel = rows[i].getString(12) === "1" ? 1 : 0;

      if (!stats[loc]) {
        stats[loc] = { cancelled: 0, total: 0 };
      }

      stats[loc].total++;
      if (custCancel === 1 || drivCancel === 1) {
        stats[loc].cancelled++;
      }
    }

    for (let loc in stats) {
      let proportion = stats[loc].cancelled / stats[loc].total;
      allLocations.push({
        name: loc,
        ratio: proportion
      });
    }

    // Sort from highest to lowest
    allLocations.sort((a, b) => b.ratio - a.ratio);

    worstData = allLocations.slice(0, 5);
    bestData = allLocations.slice(-5);
    bestData.reverse();
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
    p.text('Best and Worst Uber Destinations', p.width / 2, 50);

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
    const maxBarWidth = 250;

    // Auto-scale bar width
    let maxRatio = p.max([...worstData, ...bestData].map(d => d.ratio)) || 0.1;

    for (let i = 0; i < 5; i++) {
      let y = 140 + i * (barHeight + spacing);

      // left blue bars
      if (bestData[i]) {
        let wLeft = p.map(bestData[i].ratio, 0, maxRatio, 5, maxBarWidth);
        let percLeft = p.nf(bestData[i].ratio * 100, 1, 1) + "%";

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
        p.text(percLeft, centerX - wLeft + 5, y + barHeight / 2);
      }

      // right red bars
      if (worstData[i]) {
        let wRight = p.map(worstData[i].ratio, 0, maxRatio, 5, maxBarWidth);
        let percRight = p.nf(worstData[i].ratio * 100, 1, 1) + "%";

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
        p.text(percRight, centerX + wRight - 5, y + barHeight / 2);
      }
    }

    // Center Vertical Axis
    p.stroke(150);
    p.strokeWeight(2);
    p.line(centerX, 120, centerX, 500);
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