const canvas = document.getElementById('explosion');
const gfx = canvas.getContext('2d');

const POS_SCALE = 8;
const SIZE_SCALE = 6;
const SIZE_MIN = 4;
const SIZE_DECAY = 0.95;

const VEL_SCALE = 12 / 50;
const VEL_MIN = 4 / 50;
const VEL_DECAY = 0.92;

class ExplosionParticle {
  constructor(x, y) {
    this.x = x + (Math.random() - 0.5) * POS_SCALE * 2;
    this.y = y + (Math.random() - 0.5) * POS_SCALE * 2;
    const velMag = Math.random() * VEL_SCALE + VEL_MIN;
    const dir = Math.random() * 2 * Math.PI;
    this.velX = Math.cos(dir) * velMag;
    this.velY = Math.sin(dir) * velMag;

    const size = Math.random() * SIZE_SCALE + SIZE_MIN;
    this.size = size;
  }

  update(dt) {
    this.x += this.velX * dt;
    this.y += this.velY * dt;

    this.velX *= VEL_DECAY;
    this.velY *= VEL_DECAY;
    this.size *= SIZE_DECAY;
  }
}

class Explosion {
  constructor(gfx, x, y) {
    this.gfx = gfx;
    this.particles = [];
    for (let i = 0; i < 50; i++) {
      this.particles.push(new ExplosionParticle(x, y));
    }
  }

  update(dt) {
    this.gfx.fillStyle = 'white';
    for (let i = 0; i < this.particles.length; i++) {
      const part = this.particles[i];
      part.update(dt);
      if (part.size < SIZE_MIN / 10) {
        this.particles.splice(i, 1);
        i -= 1;
      }
      this.gfx.fillRect(part.x, part.y, part.size, part.size);
    }
  }
}

const width = 512;
const height = 512;
canvas.width = gfx.width = width;
canvas.height = gfx.height = height;
canvas.style.width = width / 2 + 'px';
canvas.style.height = height / 2 + 'px';

const explosions = [];

setInterval(() => {
  explosions.push(new Explosion(gfx, Math.random() * width / 2 + width / 4, Math.random() * height / 2 + height / 4));
}, 100);

let lastFrame = Date.now();

function update() {
  requestAnimationFrame(update);

  let dt = Date.now() - lastFrame;

  gfx.fillStyle = 'black';
  gfx.fillRect(0, 0, width, height);

  for (let i = 0; i < explosions.length; i++) {
    let expl = explosions[i];
    expl.update(dt);
    if (expl.particles.length === 0) {
      explosions.splice(i, 1);
      i -= 1;
    }
  }

  lastFrame += dt;
}

requestAnimationFrame(update);
