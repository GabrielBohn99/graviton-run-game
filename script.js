let startGame = false;
document.getElementById("start-button").onclick = () => {
  if (!startGame) {
    myGameArea.startGame();
    startGame = true;
  }
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let frames = 0;
let obsArr = [];
let naveArr = [];
const SPRITE_SIZE = 36;

// Images
let img = new Image();
img.src = "images/space-bg.jpg";
let img2 = new Image();
img2.src = "images/laser-sprite-png-6-180.png";
let img4 = new Image();
img4.src = "images/laser-sprite-png-6.png";
let img3 = new Image();
img3.src = "images/space-marine-run.png";
let img5 = new Image();
img5.src = "images/BT2001.png";
let img6 = new Image();
img6.src = "images/cannon-modified.png";
let img7 = new Image();
img7.src = "images/cannon-modified-180.png";
let img8 = new Image();
img8.src = "images/spaceship.png";
let img9 = new Image();
img9.src = "images/spaceship2.png";
let img10 = new Image();
img10.src = "images/space-marine-run-180.png";
let img11 = new Image();
img11.src = "images/spaceship3.png";
let img12 = new Image();
img12.src = "images/spaceship4.png";
let img13 = new Image();
img13.src = "images/GAME-OVER.jpg";

// Audios
let audio = new Audio();
audio.src = "audios/lase-sound.mp3";
let audio2 = new Audio();
audio2.src = "audios/bg-sound-start.mp3";
let audio3 = new Audio();
audio3.src = "audios/bg-sound-speed-up.mp3";

// declaring main objects and game parts

// game area
var myGameArea = {
  points: 0,
  topScore: 0,
  groundY: 270,
  y: 270,
  height: 30,
  startGame: function() {
    audio2.play();
    obstacles.addObs();
    requestId = window.requestAnimationFrame(updateGameArea);
  },

  clear: function() {
    ctx.clearRect(0, 0, 500, 300);
  },

  stop: function() {
    audio2.pause();
    audio3.pause();
    backgroundImage.speed = -1;
    spaceship.velocity = 3;
    player.gravity = 1.5;
    startGame = false;
    player.normalG = true;
    player.y = 250;
    audio.play();
    this.score(true);
    frames = 0;
    obsArr = [];
    if (this.points > this.topScore) {
      this.topScore = this.points;
    }
    ctx.beginPath();
    ctx.drawImage(img13, 0, 0, 500, 300);
    ctx.beginPath();
    ctx.font = "40px sans-serif";
    ctx.fillText("Final Score:" + this.points, 125, 270);
    this.points = 0;
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.font = "25px sans-serif";
    ctx.fillText("Press Enter to restart", 120, 70);
    window.cancelAnimationFrame(requestId);
  },

  score: function(reset) {
    if (reset) {
      var points = 0;
    }
    var points = Math.floor(frames / 5);
    ctx.beginPath();
    ctx.font = "18px sans-serif";
    ctx.fillStyle = "#ebb02c";
    ctx.fillText("Score: " + points, 30, 20);
    if (this.topScore != 0) {
      ctx.fillText("Top score:" + this.topScore, 200, 20);
    }
    this.points = points;
  }
};

let backgroundImage = {
  x: 0,
  speed: -1,

  move: function() {
    this.x += this.speed;
    this.x %= 500;
  },

  draw: function() {
    ctx.drawImage(img, this.x, 0, 500, 300);
    if (this.speed < 0) {
      ctx.drawImage(img, this.x + 500, 0, 500, 300);
    } else {
      ctx.drawImage(img, this.x - img.width, 0, 500, 300);
    }
  }
};

let ceilingImg = {
  x: 0,
  speed: -6,

  move: function() {
    this.x += this.speed;
    this.x %= 500;
  },

  draw: function() {
    ctx.drawImage(img5, this.x, 0, 500, 30);
    if (this.speed < 0) {
      ctx.drawImage(img5, this.x + 500, 0, 500, 30);
    } else {
      ctx.drawImage(img5, this.x - img.width, 0, 500, 30);
    }
  }
};

let floorImg = {
  x: 0,
  speed: -6,

  move: function() {
    this.x += this.speed;
    this.x %= 500;
  },

  draw: function() {
    ctx.drawImage(img5, this.x, 270, 500, 30);
    if (this.speed < 0) {
      ctx.drawImage(img5, this.x + 500, 270, 500, 30);
    } else {
      ctx.drawImage(img5, this.x - img.width, 270, 500, 30);
    }
  }
};

// declaring player class
class Player {
  constructor(width, height, x, y, animation) {
    this.animation = animation;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    (this.normalG = true), (this.gravity = 1.5), (this.yVelocity = 0);
  }
  applyGforce() {
    this.yVelocity += this.gravity;
    this.y += this.yVelocity;
    if (this.y > myGameArea.y - 30) {
      this.y = myGameArea.y - 30;
      this.yVelocity = 0;
    }
    if (this.y < myGameArea.height) {
      this.yVelocity = 0;
      this.y = myGameArea.height;
    }
  }
  changeG() {
    this.gravity *= -1;
    if (this.normalG) {
      this.normalG = false;
    } else {
      this.normalG = true;
    }
  }
  left() {
    return this.x;
  }
  right() {
    return this.x + this.width;
  }
  top() {
    return this.y;
  }
  bottom() {
    return this.y + this.height;
  }
  crashWith(obstacle) {
    if (this.y === 30) {
      return !(
        this.bottom() < obstacle.y + 20 ||
        this.top() > obstacle.y + obstacle.height - 10 ||
        this.right() < obstacle.x ||
        this.left() > obstacle.x + obstacle.width - 8
      );
    } else if (this.y === 234) {
      return !(
        this.bottom() < obstacle.y + 20 ||
        this.top() > obstacle.y + obstacle.height - 10 ||
        this.right() < obstacle.x ||
        this.left() > obstacle.x + obstacle.width - 8
      );
    } else {
      return !(
        this.bottom() < obstacle.y + 20 ||
        this.top() > obstacle.y + obstacle.height - 18 ||
        this.right() < obstacle.x + 10 ||
        this.left() > obstacle.x + obstacle.width - 13
      );
    }
  }
}

// doing player animation
class Animation {
  constructor(frame_set, delay) {
    this.delay = delay;
    this.frame = 0;
    this.count = 0;
    this.frame_index = 0;
    this.frame_set = frame_set;
  }

  change(frame_set, delay = 15) {
    if (this.frame_set != frame_set) {
      this.count = 0;
      this.delay = delay;
      this.frame_index = 0;
      this.frame_set = frame_set;
      this.frame = this.frame_set[this.frame_index];
    }
  }

  update() {
    this.count++;

    if (this.count >= this.delay) {
      this.count = 0;

      this.frame_index =
        this.frame_index == this.frame_set.length - 1
          ? 0
          : this.frame_index + 1;
      this.frame = this.frame_set[this.frame_index];
    }
  }

  draw() {
    if (player.normalG) {
      ctx.drawImage(
        img3,
        player.animation.frame * (SPRITE_SIZE + 12),
        10,
        SPRITE_SIZE,
        SPRITE_SIZE,
        player.x,
        player.y,
        SPRITE_SIZE,
        SPRITE_SIZE
      );
    } else {
      ctx.drawImage(
        img10,
        player.animation.frame * (SPRITE_SIZE + 12),
        10,
        SPRITE_SIZE,
        SPRITE_SIZE,
        player.x,
        player.y,
        SPRITE_SIZE,
        SPRITE_SIZE
      );
    }
  }
}

// declaring how obstacles are created
let obstacles = {
  width: 30,
  velocity: 6,
  addObs: function() {
    let randomN = Math.floor(Math.random() * 2);
    let randomHeight = Math.floor(Math.random() * 100);
    if (randomN === 0) {
      randomY = 30;
    } else {
      randomY = 180 - randomHeight;
    }
    obsArr.push({
      x: 500,
      y: randomY,
      width: 30,
      height: 90 + randomHeight
    });
  },
  moveObs: function() {
    for (let i = 0; i < obsArr.length; i++) {
      let obs = obsArr[i];
      obs.x -= this.velocity;
      if (obs.x <= -30) {
        obsArr.splice(i, 1);
        i--;
      }
    }
  },
  update: function() {
    for (let i = 0; i < obsArr.length; i++) {
      let obs = obsArr[i];
      if (obs.y === 30) {
        ctx.drawImage(img2, obs.x, obs.y, obs.width, obs.height);
        ctx.drawImage(img7, obs.x, obs.y - 5, 30, 30);
      } else {
        ctx.drawImage(img4, obs.x, obs.y, obs.width, obs.height);
        ctx.drawImage(img6, obs.x, 245, 30, 30);
      }
    }
  }
};

let spaceship = {
  velocity: 3,
  addNav: function() {
    randomY = Math.floor(Math.random() * 211);
    randImg = Math.floor(Math.random() * 4);
    if (randImg === 0) {
      naveArr.push({
        x: 500,
        y: randomY + 30,
        width: 30,
        height: 45,
        image: img8
      });
    } else if (randImg === 1) {
      naveArr.push({
        x: 500,
        y: randomY + 30,
        width: 30,
        height: 45,
        image: img9
      });
    } else if (randImg === 2) {
      naveArr.push({
        x: 500,
        y: randomY + 30,
        width: 30,
        height: 45,
        image: img11
      });
    } else {
      naveArr.push({
        x: 500,
        y: randomY + 30,
        width: 30,
        height: 55,
        image: img12
      });
    }
  },
  moveNav: function() {
    for (let i = 0; i < naveArr.length; i++) {
      let nav = naveArr[i];
      nav.x -= this.velocity;
      if (nav.x <= -45) {
        naveArr.splice(i, 1);
        i--;
      }
    }
  },
  update: function() {
    for (let i = 0; i < naveArr.length; i++) {
      let nav = naveArr[i];
      ctx.drawImage(nav.image, nav.x, nav.y, 45, 30);
    }
  }
};

let controller = {
  keylistener: function(event) {
    if (event.keyCode === 32) {
      if (startGame) {
        player.changeG();
      }
    }
    if (event.keyCode === 13) {
      if (!startGame) {
        myGameArea.startGame();
        startGame = true;
      }
    }
  }
};

let sprite_sheet = {
  frame_sets: [[3, 6]]
};

//start game and functions

let player = new Player(
  SPRITE_SIZE,
  SPRITE_SIZE,
  55,
  250,
  new Animation()
);

function updateGameArea() {
  myGameArea.clear();
  frames += 1;
  // moving bg image
  backgroundImage.move();
  backgroundImage.draw();
  // drawing ceiling and floor
  ceilingImg.move();
  ceilingImg.draw();
  floorImg.move();
  floorImg.draw();
  // drawing spaceship on background
  if (frames % 240 === 0) {
    spaceship.addNav();
  }
  spaceship.moveNav();
  spaceship.update();
  // drawing player
  player.animation.change(sprite_sheet.frame_sets[0], 8);
  player.animation.update();
  player.animation.draw();
  player.applyGforce();
  // creating, moving, and drawing obstacles
  if (frames < 2000) {
    audio2.pause();
    audio3.play();
    backgroundImage.speed = -2;
    if (frames % 50 === 0) {
      obstacles.addObs();
    }
  } else if (frames < 4000) {
    backgroundImage.speed = -3;
    if (frames % 40 === 0) {
      obstacles.addObs();
    }
  } else if (frames < 5500) {
    spaceship.velocity = 4;
    backgroundImage.speed = -4;
    if (frames % 30 === 0) {
      obstacles.addObs();
    }
  } else if (frames < 7500) {
    spaceship.velocity = 5;
    backgroundImage.speed = -5;
    if (frames % 25 === 0) {
      obstacles.addObs();
    }
  } else {
    if (player.normalG) {
      backgroundImage.speed = -6;
      spaceship.velocity = 6;
      player.gravity = 3;
    } else {
      player.gravity = -3;
    }
    if (frames % 20 === 0) {
      obstacles.addObs();
    }
  }
  obstacles.moveObs();
  obstacles.update();
  // animate the canvas
  requestId = window.requestAnimationFrame(updateGameArea);
  // update and draw the score
  myGameArea.score();
  // check if the game should stop
  checkGameOver();
}

function checkGameOver() {
  let crashed = obsArr.some(function(obstacle) {
    return player.crashWith(obstacle);
  });

  if (crashed) {
    myGameArea.stop();
  }
}

// get player command
window.addEventListener("keydown", controller.keylistener);
