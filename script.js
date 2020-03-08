document.getElementById("start-button").onclick = () => {
  myGameArea.startGame();
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let frames = 0;
let obsArr = [];

//Images
let img = new Image();
img.src = "images/space-bg.jpg";

//declaring main objects and game parts

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
    // clearInterval(this.interval);
    window.cancelAnimationFrame(requestId);
  }
}

class Player {
  constructor(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
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
  // left() {
  //   return this.x;
  // }
  // right() {
  //   return this.x + this.width;
  // }
  // top() {
  //   return this.y;
  // }
  // bottom() {
  //   return this.y + this.height;
  // }

  // crashWith(obstacle) {
  //   return !(
  //     this.bottom() < obstacle.top() ||
  //     this.top() > obstacle.bottom() ||
  //     this.right() < obstacle.left() ||
  //     this.left() > obstacle.right()
  //   );
  // }
}

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
    if (event.keyCode === 32) {
      console.log("changeG!!!!");
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
  // moving bg image
  frames += 1;
  backgroundImage.move();
  backgroundImage.draw();
  myGameArea.ground();
  myGameArea.ceiling();
  // update the player's position before drawing
  player.update();
  player.applyGforce();
  // newPlayer.newPos();
  // newPlayer.update();
  // update the obstacles array
  if (frames % 60 === 0) {
    obstacles.addObs();
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
  var crashed = obsArr.some(function(obstacle) {
    return player.crashWith(obstacle);
  });

  if (crashed) {
    stop();
  }
}

//editar dps os nomes da chamada
window.addEventListener("keydown", controller.keylistener);
