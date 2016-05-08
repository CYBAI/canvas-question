const box = document.getElementById('box');
const boxContext = box.getContext('2d');

let rAF;
let counter = 0;
let lasttime = 0;
let imageLoaded = 0;
const images = Array.from(new Array(12), (val, idx) => {
  const img = new Image();
  img.src = `images/${idx}.png`;
  img.onload = () => {
    imageLoaded += 1;
    if (imageLoaded === 12) {
      drawloop();
    }
  };
  return img;
});

function draw() {
  const thisImg = images[counter];
  const x = (box.width / 4) * (counter % 4);
  const y = (box.height / 3) * Math.floor((counter + 1) % 3);
  boxContext.drawImage(
    thisImg,
    x, y,
    box.width / 4, box.height / 4
  );
}

function drawloop() {
  if (counter > 11 && rAF) {
    cancelAnimationFrame(rAF);
    rAF = undefined;
    console.log('Show 12 images done.');
    return;
  }

  const now = performance.now();
  if (now - lasttime > 10000 || lasttime === 0) {
    draw();
    lasttime = now;
    counter += 1;
  }
  rAF = requestAnimationFrame(drawloop);
}
