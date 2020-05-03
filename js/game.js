var pc = 0;
const GAMESTATE = {
  paused: 0,
  running: 1,
  menu: 2,
  gameover: 3,
  newlevel: 4,
  gamecomplete: 5,
  info: 6
};

export default class Game {
  constructor(gameWidth, gameHeight) {
    this.gameHeight = gameHeight;
    this.gameWidth = gameWidth;
    this.gameState = GAMESTATE.menu;
    this.score = 0;
    this.immune = false;
    this.dataX;
    this.dataY;
    this.pauseBTn = document.getElementById("pause");
    this.jumpSound = document.getElementById("jump");
    this.bgSound = document.getElementById("bgMusic");
    this.deadSound = document.getElementById("dead");
    this.collectSound = document.getElementById("collect");

    this.bgSound.addEventListener("ended", e => {
      this.play();
    });

    this.lives = 1;
    this.gameState = 2;

    this.counter = 0;
    this.ops = 400;
    document.getElementById("play").addEventListener("click", e => {
      e.target.parentElement.parentElement.className += " hide";
      this.start();
    });
    document.getElementById("scores").addEventListener("click", e => {
      e.target.parentElement.parentElement.nextElementSibling.classList.remove(
        "hide"
      );
      e.target.parentElement.parentElement.className += " hide";
      this.gameState = 2;
    });

    document.querySelector(".back").addEventListener("click", e => {
      e.target.parentElement.parentElement.previousElementSibling.classList.remove(
        "hide"
      );
      e.target.parentElement.parentElement.className += " hide";
      this.gameState = 2;
    });

    this.pauseBTn.addEventListener("click", e => {
      this.togglePause();
    });

    this.putScores();
  }
  start() {
    if (
      this.gameState != GAMESTATE.menu &&
      this.gameState != GAMESTATE.newlevel
    )
      return;
    this.lives = 1;
    this.gameState = 1;
    this.ops = 400;
    this.bgSound.play();
    this.pauseBTn.classList.remove("hide");
    this.score = 0;
    this.gameState = GAMESTATE.running;
  }

  update() {
    if (this.gameState != GAMESTATE.running) return;
  }
  draw(ctx) {
    if (this.gameState == GAMESTATE.menu) {
      return;
    }

    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    var highScore;
    if (localStorage.getItem("switchscores") != null) {
      var scores = JSON.parse(localStorage.getItem("switchscores"));
      highScore = scores[4];
    } else {
      highScore = 0;
    }
    ctx.fillText(`Current Score : ${this.score}`, 10, 40);
    ctx.fillText(`High Score : ${highScore}`, 10, 70);

    if (this.gameState === GAMESTATE.gameover) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fill();
      ctx.font = "32px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("GameOver", this.gameWidth / 2, this.gameHeight / 2);
      ctx.fillText(
        "Double Tap to Replay",
        this.gameWidth / 2,
        this.gameHeight / 2 + 50
      );
    }
    if (this.gameState === GAMESTATE.gamecomplete) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      ctx.fill();
      ctx.font = "32px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("GameComplete", this.gameWidth / 2, this.gameHeight / 2);
    }
    if (this.gameState === GAMESTATE.paused) {
      ctx.rect(0, 0, this.gameWidth, this.gameHeight);
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fill();
      ctx.font = "32px Arial";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText("Paused", this.gameWidth / 2, this.gameHeight / 2);
    }
  }

  togglePause() {
    if (this.gameState === GAMESTATE.paused) {
      this.gameState = GAMESTATE.running;
    } else this.gameState = GAMESTATE.paused;
    if (pc % 2 == 0) {
      this.pauseBTn.src = "imgs/play.png";
    } else {
      this.pauseBTn.src = "imgs/pause.png";
    }
    pc++;
  }

  putScores() {
    var scoreList = document.querySelector(".scores");
    var scores = [];
    if (localStorage.getItem("switchscores") != null) {
      scores = JSON.parse(localStorage.getItem("switchscores"));
    }
    scores.sort(function (a, b) {
      return a - b;
    });
    var l = scores.length > 5 ? 5 : scores.length;
    for (var i = scores.length - 1; i >= scores.length - l; i--) {
      var item = document.createElement("li");
      item.className = "score-item";
      item.innerHTML = `${scores[i]}`;
      scoreList.appendChild(item);
    }
  }

  updateScores() {
    var scores;
    if (localStorage.getItem("switchscores") != null) {
      scores = JSON.parse(localStorage.getItem("switchscores"));
    } else {
      scores = [0, 0, 0, 0, 0];
    }
    if (scores.length < 5) {
      for (var i = 0; i < 5 - scores.length; i++) {
        scores.push(0);
      }
    }
    for (var i = 4; i >= 0; i--) {
      if (scores[i] < this.score) {
        var j = 0;
        while (j < i) {
          scores[j] = scores[j + 1];
          j++;
        }
        scores[i] = this.score;
        break;
      }
    }
    scores.sort(function (a, b) {
      return a - b;
    });
    scores.splice(0, scores.length - 5);
    localStorage.setItem("switchscores", JSON.stringify(scores));
  }
}

function getRndInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
