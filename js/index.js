const box = document.getElementById('box');
const boxContext = box.getContext('2d');

let rAF;
let counter = 0;
let lasttime = 0;
const resources = Array.from(new Array(12), (val, idx) => `images/${idx}.png`);

function draw() {
  const x = (counter + 1) * 10;
  const y = (counter + 1) * 10;
  boxContext.fillText(resources[counter], x, y);
}

(function drawloop() {
  if (counter > 12 && rAF) {
    return cancelAnimationFrame(rAF);
  }

  const now = performance.now();
  if (now - lasttime > 10000 || lasttime === 0) {
    draw();
    lasttime = now;
    counter += 1;
  }
  rAF = requestAnimationFrame(drawloop);
}());
