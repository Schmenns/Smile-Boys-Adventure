const tilesize = 128;

const c = document.querySelector('#c');
const ctx = c.getContext('2d');

c.width = window.innerWidth;
c.height = window.innerHeight;

let map = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
]

let player = {
  x: map[0].length * tilesize / 2 + tilesize / 2,
  y: 10 * tilesize + 14,
  xv: 0,
  yv: 0,
  speed: 25,
  onGround: false,
  flipped: false,
  isFlipping: false,
  img: document.createElement('img'),
}
player.img.src = 'Images/Smile Boy/Right.png';
Math.__proto__.clamp = (val, min, max) => { if (val < min) val = min; if (val > max) val = max; return val; } // Math.clamp 
player.speed = ((-(Math.clamp(player.speed, 0, 100) - 50)) + 50) / 100;

let cam = {
  x: player.x - window.innerWidth / 2 + tilesize / 2,
  y: player.y - window.innerHeight / 2 + tilesize / 2 - 130,
}

let grass = document.createElement('img');
grass.src = 'Images/Grass.png';

let key = [];

let transitions = {
  rightLeft:
  new AnimatedGif(['Right', '3 Quarters', 'Half', '1 Quarter', 'Left'].map(e => {
    let frame = document.createElement('img');
    frame.src = `./Images/Smile Boy/${e}.png`;
    return frame;
  }), 1000 / 10),

  leftRight:
  new AnimatedGif(['Left', '1 Quarter', 'Half', '3 Quarters', 'Right'].map(e => {
    let frame = document.createElement('img');
    frame.src = `./Images/Smile Boy/${e}.png`;
    return frame;
  }), 1000 / 10),
}


window.addEventListener('resize', () => { c.width = window.innerWidth; c.height = window.innerHeight }); // Resize

let update = () => {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight); // Background 

  // Move 
  player.x += player.xv; player.xv *= player.speed;
  player.y += player.yv; player.yv += 1;

  player.x = Math.clamp(player.x, 0, map[0].length * tilesize - tilesize);
  player.y = Math.clamp(player.y, 0, map.length * tilesize - tilesize);

  // Camera
  cam.x = Math.clamp(player.x - window.innerWidth / 2 + tilesize / 2, 0, map[0].length * tilesize - window.innerWidth);
  //cam.y = Math.clamp(player.y - window.innerHeight / 2 + tilesize / 2, 0, map.length * tilesize - window.innerHeight);



  keyPressed();
  playerCollisions();

  drawMap();

  let isAnimating = false;
  Object.keys(transitions).forEach(i => {
    if(transitions[i].playing) {
      isAnimating = true;
      ctx.drawGif(transitions[i], player.x - cam.x, player.y - cam.y, tilesize, tilesize)
    }
  });
  if(!isAnimating) drawImage(player.img, player.x - cam.x, player.y - cam.y, tilesize, tilesize, 0, player.flipped, false); // Player
}

window.addEventListener('keydown', data => key[data.key] = true);
window.addEventListener('keyup', data => key[data.key] = false);
let keyPressed = () => {
  if(!(key['ArrowRight'] && key['ArrowLeft'])) {
    if (key['ArrowRight']) { 
      if(player.flipped) {
        transitions.leftRight.playOnce(20, () => {
          player.flipped = false;
        });
      }   
      player.xv += 2; player.flipped = false;
    }

    if (key['ArrowLeft']) { 
      if(!player.flipped) {
        transitions.rightLeft.playOnce(20, () => {
          player.flipped = true;
        });
      } 
      player.xv -= 2; player.flipped = true;
    }
  } 

  if (key['ArrowUp'] && player.onGround) player.yv -= 22; player.onGround = false;
}

let playerCollisions = () => {
  while (map[Math.floor(player.y / tilesize + 1)][Math.floor(player.x / tilesize)] == 1) {
    player.yv = 0;
    player.y -= 0.01;

    player.onGround = true;
  }
}

let drawMap = () => {
  for (let row = 0; row < map.length; row++)
    for (let col = 0; col < map[row].length; col++) {
      switch (map[row][col]) {
        case 0:
          ctx.fillStyle = ctx.strokeStyle = '#0ae';
          ctx.strokeRect(col * tilesize - cam.x, row * tilesize - cam.y, tilesize, tilesize)
          ctx.fillRect(col * tilesize - cam.x, row * tilesize - cam.y, tilesize, tilesize);
          break;
        case 2:
          ctx.strokeRect(col * tilesize - cam.x, row * tilesize - cam.y, tilesize, tilesize)
          ctx.fillStyle = ctx.strokeStyle = '#730';
          ctx.fillRect(col * tilesize - cam.x, row * tilesize - cam.y, tilesize, tilesize);
          break;

        case 1:
          ctx.fillStyle = ctx.strokeStyle = '#730';
          ctx.strokeRect(col * tilesize - cam.x, row * tilesize - cam.y, tilesize - 1, tilesize - 1)
          ctx.fillRect(col * tilesize - cam.x, row * tilesize - cam.y, tilesize, tilesize);
          ctx.drawImage(grass, col * tilesize - cam.x, row * tilesize - cam.y, tilesize, tilesize);
          break;
      }
    }
}

setInterval(update, 1000 / 60);
