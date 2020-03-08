document.getElementById("start-button").onclick = () => {
  startGame();
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let frames = 0;
let obsArr = [];

//Images
let img = new Image();
img.src = "images/space-bg.jpg";

//declaring main objects and game parts

let player = {
  height: 30,
  width: 20,
  y: 250,
  normalG: true,
  gravity: 1.5,
  yVelocity: 0,

  applyGforce: function() {
    this.yVelocity += this.gravity;
    this.y += this.yVelocity;

    if (this.normalG) {
      if (this.y > ground.y - 30) {
        this.y = ground.y - 30;
        this.yVelocity = 0;
      }
    } else {
      if (this.y < ceiling.height) {
        this.yVelocity = 0;
        this.y = ceiling.height;
      }
    }
  },

  changeG: function() {
    this.gravity *= -1;
    if (this.normalG) {
      this.normalG = false;
    } else {
      this.normalG = true;
    }
  },

  update: function() {
    ctx.fillStyle = "red";
    ctx.fillRect(55, this.y, 20, 30);
  },

  right() {
    return this.x + this.width;
  },

  top() {
    return this.y;
  },

  bottom() {
    return this.y + this.height;
  },

  crashWith(obstacle) {
    return !(
      this.bottom() < obstacle.top() ||
      this.top() > obstacle.bottom() ||
      this.right() < obstacle.left() ||
      this.left() > obstacle.right()
    );
  }
};

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
    // if (frames % 100 === 0) {
    //   this.addObs();
    for (let i = 0; i < obsArr.length; i++) {
      let obs = obsArr[i];
      obs.x -= this.velocity;
      // console.log(obs.x);
      if (obs.x <= -30) {
        obsArr.splice(i, 1);
        i--;
      }
    }
    // }
  },
  update: function() {
    for (let i = 0; i < obsArr.length; i++) {
      let obs = obsArr[i];
      ctx.fillStyle = obs.cor;
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }
  },

  left() {
    return this.x;
  },

  right() {
    return this.x + this.width;
  },

  top() {
    return this.y;
  },

  bottom() {
    return this.y + this.height;
  },
};

let ground = {
  y: 280,
  draw: function() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, this.y, 500, 20);
  }
};

let ceiling = {
  height: 20,
  draw: function() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 500, this.height);
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

function startGame() {
  //   obstacles.addObs();
  obstacles.addObs();
  requestId = window.requestAnimationFrame(updateGameArea);
}

function clear() {
  //   console.log("clear");
  ctx.clearRect(0, 0, 500, 300);
}

function stop() {
    // clearInterval(this.interval);
    window.cancelAnimationFrame(requestId);
}

function updateGameArea() {
  clear();
  // moving bg image
  frames += 1;
  backgroundImage.move();
  backgroundImage.draw();
  ground.draw();
  ceiling.draw();
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
