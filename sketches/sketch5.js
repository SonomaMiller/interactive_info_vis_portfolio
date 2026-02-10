// Homework 5: Uber destination bar chart
registerSketch('sk5', function (p) {
  let table;
  let isPickupMode = true;
  let chartData = [];

  p.preload = () => {
    table = p.loadTable("ncr_ride_bookings.csv", "csv", "header");
  };

  p.setup = () => {
    p.createCanvas(800, 800);
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

      // error handling
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

    allLocations.sort((a, b) => b.ratio - a.ratio);

    // Get the 5 lowest (Blue) and 5 highest (Red)
    let lowest = allLocations.slice(0, 5);
    let highest = allLocations.slice(-5);
    chartData = lowest.concat(highest);
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
    p.text(isPickupMode ? "Pickup" : "Dropoff", knobX + 28, 35);

    p.fill(100);
    p.textAlign(p.LEFT);
    p.text(isPickupMode ? "Dropoff" : "Pickup", isPickupMode ? 90 : 30, 35);

    p.textAlign(p.CENTER, p.CENTER);
    p.fill(50);
    p.textSize(20);
    p.text('Uber Destinations by Proportion of Canceled Rides', p.width / 2, 50);

    if (chartData.length === 0) {
      p.text("Processing data...", p.width / 2, p.height / 2);
      return;
    }

    const centerX = p.width / 2;
    const barHeight = 40;
    const spacing = 30;
    const maxBarWidth = 250;
    let maxRatio = p.max(chartData.map(d => d.ratio)) || 1;

    for (let i = 0; i < chartData.length; i++) {
      let y = 120 + i * (barHeight + spacing);
      let w = p.map(chartData[i].ratio, 0, maxRatio, 5, maxBarWidth);
      let percentageText = p.nf(chartData[i].ratio * 100, 1, 1) + "%";

      // Left bars blue, right bars red
      if (i < 5) {
        p.fill("skyblue");
        p.noStroke();
        // Draw to the left of the axis
        p.rect(centerX - w, y, w, barHeight);

        // name of location outside bar
        p.textAlign(p.RIGHT, p.CENTER);
        p.fill(0);
        p.textSize(11);
        p.text(chartData[i].name, centerX - w - 10, y + barHeight / 2);

        // percentage inside bar
        p.textAlign(p.LEFT, p.CENTER);
        p.fill(255);
        p.text(percentageText, centerX - w + 5, y + barHeight / 2);
      } else {
        p.fill("crimson");
        p.rect(centerX, y, w, barHeight);

        // name outside bar
        p.textAlign(p.LEFT, p.CENTER);
        p.fill(0);
        p.textSize(11);
        p.text(chartData[i].name, centerX + w + 10, y + barHeight / 2);

        // percentage inside bar
        p.textAlign(p.RIGHT, p.CENTER);
        p.fill(255);
        p.text(percentageText, centerX + w - 5, y + barHeight / 2);
      }
    }

    // Center Vertical Axis
    p.stroke(150);
    p.strokeWeight(2);
    p.line(centerX, 100, centerX, 795);
  };
});
