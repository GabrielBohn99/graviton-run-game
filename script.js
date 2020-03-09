document.getElementById("start-button").onclick = () => {
  myGameArea.startGame();
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let frames = 0;
let obsArr = [];

// Images
let img = new Image();
img.src = "images/space-bg.jpg";

// declaring main objects and game parts
// game area
var myGameArea = {
  frames: 0,
  groundY: 280,
  y: 280,
  height: 20,
  startGame: function() {
    obstacles.addObs();
    requestId = window.requestAnimationFrame(updateGameArea);
  },

  ground: function() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, this.groundY, 500, 20);
  },

  ceiling: function() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 500, this.height);
  },

  clear: function() {
    ctx.clearRect(0, 0, 500, 300);
  },

  stop: function() {
    console.log("game over");
    window.cancelAnimationFrame(requestId);
  }
};

// declaring player class
class Player {
  constructor(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.top = this.y;
    this.left = this.x;
    this.right = this.x + this.width;
    this.bottom = this.y + this.height;
    (this.normalG = true), (this.gravity = 1.5), (this.yVelocity = 0);
  }
  update() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  applyGforce() {
    this.yVelocity += this.gravity;
    this.y += this.yVelocity;
    if (this.normalG) {
      if (this.y > myGameArea.y - 30) {
        this.y = myGameArea.y - 30;
        this.yVelocity = 0;
      }
    } else {
      if (this.y < myGameArea.height) {
        this.yVelocity = 0;
        this.y = myGameArea.height;
      }
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
  crashWith(obstacle) {
    if (this.normalG) {
      return !(
        this.bottom < obstacle.y ||
        this.top > obstacle.y + obstacle.height ||
        this.right < obstacle.x
      );
    } else {
      return !(
        this.bottom > obstacle.y ||
        this.top < obstacle.y + obstacle.height ||
        this.right > obstacle.x
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
    let randomHeight = Math.floor(Math.random() * 180);
    if (randomN === 0) {
      randomY = 20;
    } else {
      randomY = 250 - randomHeight;
    }
    obsArr.push({
      x: 500,
      y: randomY,
      width: 30,
      height: 30 + randomHeight,
      cor: "#" + Math.floor(Math.random() * 16777216).toString(16)
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
      ctx.fillStyle = obs.cor;
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }
  }
};

let controller = {
  keylistener: function(event) {
    if (event.keyCode === 71) {
      player.changeG();
    }
  }
};

let backgroundImage = {
  img: img,
  x: 0,
  speed: -1,

  move: function() {
    // console.log('move image')
    this.x += this.speed;
    this.x %= 500;
  },

  draw: function() {
    ctx.drawImage(this.img, this.x, 0);
    // console.log('draw image');
    if (this.speed < 0) {
      ctx.drawImage(this.img, this.x + 500, 0);
    } else {
      ctx.drawImage(this.img, this.x - this.img.width, 0);
    }
  }
};

//start game and functions

let player = new Player(20, 30, "red", 55, 250);

function updateGameArea() {
  myGameArea.clear();
  frames += 1;
  // moving bg image
  backgroundImage.move();
  backgroundImage.draw();
  // drawing ceiling and floor
  myGameArea.ground();
  myGameArea.ceiling();
  // drawing player
  player.update();
  player.applyGforce();
  // creating, moving, and drawing obstacles
  if (frames < 2000) {
    if (frames % 50 === 0) {
      obstacles.addObs();
    }
  } else if (frames < 4000) {
    if (frames % 40 === 0) {
      obstacles.addObs();
    }
  } else if (frames < 5200) {
    if (frames % 30 === 0) {
      obstacles.addObs();
    }
  } else if (frames < 7300) {
    if (frames % 25 === 0) {
      obstacles.addObs();
    }
  } else {
    if (player.normalG) {
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
  // check if the game should stop
  // checkGameOver();
  // update and draw the score
  // myGameArea.score();
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
