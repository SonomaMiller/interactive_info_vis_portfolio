// Homework 5: Uber destination bar chart
registerSketch('sk5', function (p) {
  let table;
  let budgetValues = [];
  let numberOfRows, numberOfColumns;

  p.preload = () => {
    table = p.loadTable("../test.csv", "csv", "header");
  };

  p.setup = () => {
    p.createCanvas(400, 500);
    p.textAlign(p.CENTER, p.CENTER);

    if (table) {
      numberOfRows = table.getRowCount();
      numberOfColumns = table.getColumnCount();
    }
  };

  p.draw = () => {
    p.background(220);

    p.fill(0);
    p.textSize(20);
    p.text('title', p.width / 2, 30);

    if (!table) return;

    p.textSize(10);
    for (let i = 0; i < numberOfRows; i++) {
      let locationName = table.getString(i, 0);
      budgetValues[i] = p.float(table.getString(i, 1));

      let x = i * 35 + 80;
      let yBaseline = 400;
      let barWidth = 20;

      p.fill(100, 150, 250);
      p.rect(x, yBaseline - budgetValues[i], barWidth, budgetValues[i]);

      p.fill(0);
      p.text(locationName, x + barWidth / 2, yBaseline + 20);
    }

    let maxValue = p.max(budgetValues) || 0;
    p.textAlign(p.RIGHT);
    for (let k = 0; k <= maxValue; k += 50) {
      p.text(k, 50, 400 - k);
    }
  };
});
