// Homework 5: Uber destination bar chart
registerSketch('sk5', function (p) {
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background("white");
  };

  p.draw = function () {
    p.background("white");

  }

  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
