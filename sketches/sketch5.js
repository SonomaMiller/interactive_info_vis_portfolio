// Homework 5: Uber destination bar chart
registerSketch('sk5', function (p) {
  let table;
  let isPickupMode = true;
  let chartData = [];

  p.preload = () => {
    table = p.loadTable("test.csv", "csv", "header");
  };

  p.setup = () => {
    p.createCanvas(700, 550);
    processRideData();
    p.noLoop();
  };

  function processRideData() {
    let stats = {};
    let rows = table.getRows();
    chartData = []; // Clear previous data
    let colIndex = isPickupMode ? 6 : 7;

    for (let i = 0; i < rows.length; i++) {
      // pick up location
      let loc = rows[i].getString(6);

      //if null or empty, ignored
      let custCancel = rows[i].getString(10) === "1" ? 1 : 0;
      let drivCancel = rows[i].getString(12) === "1" ? 1 : 0;

      if (!loc || loc === "null") continue; // this is just error handling

      if (!stats[loc]) {
        stats[loc] = { cancelled: 0, total: 0 };
      }

      stats[loc].total++;
      if (custCancel === 1 || drivCancel === 1) {
        stats[loc].cancelled++;
      }
    }

    // convert stats object to an array for sorting
    for (let loc in stats) {
      let proportion = stats[loc].cancelled / stats[loc].total;
      chartData.push({
        name: loc,
        ratio: proportion
      });
    }

    // Sort lowest proportion of cancels (left) to highest
    chartData.sort((a, b) => a.ratio - b.ratio);

    // get 5 locations with highest proportions
    chartData = chartData.slice(-5);
  }

  p.draw = () => {
    p.background("white");

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
    p.text(isPickupMode ? "Pickup" : "Drop", knobX + 28, 35);

    p.fill(100);
    p.textAlign(p.LEFT);
    p.text(isPickupMode ? "Drop" : "Pickup", isPickupMode ? 90 : 30, 35);

    p.textAlign(p.CENTER, p.CENTER);
    p.fill(50);
    p.textSize(20);
    p.text('Uber Destinations by Proportion of Canceled Rides', p.width / 2, 50);

    if (chartData.length === 0) {
      p.text("Processing data...", p.width/2, p.height/2);
      return;
    }

    const centerX = p.width / 2;
    const barHeight = 40;
    const spacing = 30;
    const maxBarWidth = 250; // Max pixels for a 100% ratio

    for (let i = 0; i < chartData.length; i++) {
      let y = 120 + i * (barHeight + spacing);

      // if proportion is 0, draw a line so it's visible
      let w = p.max(chartData[i].ratio * maxBarWidth, 2);

      // Left bars blue, right bars red
      if (i < 2) {
        p.fill("blue");
        p.noStroke();
        // Draw to the left of the axis
        p.rect(centerX - w, y, w, barHeight);

        // Labels on the left
        p.textAlign(p.RIGHT, p.CENTER);
        p.fill(0);
        p.text(chartData[i].name, centerX - w - 10, y + barHeight / 2);
        p.text(p.nf(chartData[i].ratio * 100, 1, 1) + "%", centerX - 5, y + barHeight / 2);
      } else {
        p.fill("red");
        p.noStroke();
        // Draw to the right of the axis
        p.rect(centerX, y, w, barHeight);

        // Labels on the right
        p.textAlign(p.LEFT, p.CENTER);
        p.fill(0);
        p.text(chartData[i].name, centerX + w + 10, y + barHeight / 2);
        p.text(p.nf(chartData[i].ratio * 100, 1, 1) + "%", centerX + 5, y + barHeight / 2);
      }
    }

    // Center Vertical Axis
    p.stroke(150);
    p.strokeWeight(2);
    p.line(centerX, 100, centerX, 450);
  };
});
