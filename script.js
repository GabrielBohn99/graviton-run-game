document.getElementById("start-button").onclick = () => {
  startGame();
};

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let frames = 0;

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

  pulo: function() {
    this.gravity *= -1;
    if (this.normalG) {
      this.normalG = false;
    } else {
      this.normalG = true;
    }
  },

  draw: function() {
    ctx.fillStyle = "red";
    ctx.fillRect(55, this.y, 20, 30);
  }
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
      console.log("pulo!!!!");
      player.pulo();
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
  requestId = window.requestAnimationFrame(updateGameArea);
}

function clear() {
  //   console.log("clear");
  ctx.clearRect(0, 0, 500, 300);
}

function updateGameArea() {
  // update the player's position before drawing
  clear();
  // newPlayer.newPos();
  // newPlayer.update();
  // moving bg image
  backgroundImage.move();
  backgroundImage.draw();
  ground.draw();
  ceiling.draw();
  player.draw();
  player.applyGforce();
  // update the obstacles array
  // updateObstacles();
  // animate the canvas
  requestId = window.requestAnimationFrame(updateGameArea);
  // check if the game should stop
  // checkGameOver();
  // update and draw the score
  // myGameArea.score();
}

//editar dps os nomes da chamada
window.addEventListener("keydown", controller.keylistener);
