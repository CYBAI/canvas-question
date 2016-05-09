const shuffleArray = (array) => {
  let m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
};

class ImageCanvas {
  constructor() {
    this.box = document.getElementById('box');
    this.boxContext = this.box.getContext('2d');
    this.rAF = null;
    this.counter = 0;
    this.lasttime = 0;
    this.imageLoaded = 0;
  }

  init() {
    this.order = shuffleArray(Array.from(new Array(12), (val, idx) => idx));
    this.images = shuffleArray(Array.from(new Array(12), (val, idx) => {
      const img = new Image();
      img.src = `images/${idx}.png`;
      img.onload = () => {
        this.imageLoaded += 1;
        if (this.imageLoaded === 12) {
          this.drawloop();
        }
      };
      return img;
    }));
  }

  draw() {
    const thisImg = this.images[this.counter];
    const thisOrder = this.order[this.counter];
    const x = (this.box.width / 4) * (thisOrder % 4);
    const y = (this.box.height / 3) * Math.floor((thisOrder + 1) % 3);
    this.boxContext.drawImage(
      thisImg,
      x, y,
      this.box.width / 4, this.box.height / 3
    );
  }

  drawloop() {
    if (this.counter > 11 && this.rAF) {
      cancelAnimationFrame(this.rAF);
      this.rAF = undefined;
      console.log('Show 12 images done.');
      return;
    }

    const now = performance.now();
    if (now - this.lasttime > 10000 || this.lasttime === 0) {
      this.draw();
      this.lasttime = now;
      this.counter += 1;
    }
    this.rAF = requestAnimationFrame(this.drawloop.bind(this));
  }
}

const canvas = new ImageCanvas();
canvas.init();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then((reg) => {
    console.log('ServiceWorker register successful: ', reg);
  }).catch((err) => {
    console.log('ServiceWorker register failed: ', err);
  });
}
