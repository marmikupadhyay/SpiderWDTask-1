var pc = 0;

import Bubble from "../js/bubble.js";
import Input from "../js/input.js";

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

    this.bubbles = [];
    this.bubbles.push(new Bubble(this));
    new Input(this);
    this.time = 10;
    this.score = 0;
    this.pauseBTn = document.getElementById("pause");
    this.mouse = {
      x: 0,
      y: 0
    };
    this.mouseDown = 0;
    this.gameOverSound = document.getElementById("dead");
    this.bgMusic = document.getElementById("bgMusic");
    this.bgMusic.volume = 0.1;
    this.tickSound = document.getElementById("tick");

    this.gameArea = this.gameHeight * this.gameWidth;
    this.sumArea = 0;
    this.spawnGap = 200;
    this.lives = 1;
    this.gameState = 2;

    this.counter = 0;
    this.ops = 400;
    document.getElementById("play").addEventListener("click", e => {
      e.target.parentElement.parentElement.className += " hide";
      document.getElementById("pause").classList.remove("hide");
      this.start();
    });
    document.getElementById("scores").addEventListener("click", e => {
      e.target.parentElement.parentElement.nextElementSibling.classList.remove(
        "hide"
      );
      e.target.parentElement.parentElement.className += " hide";
      this.gameState = 2;
    });

    var backs = document.querySelectorAll(".back");
    backs.forEach(back => {
      back.addEventListener("click", e => {
        if (!document.getElementById("gameinfo").classList.contains("hide")) {
          document.getElementById("gameinfo").className += " hide";
        } else {
          e.target.parentElement.parentElement.previousElementSibling.classList.remove(
            "hide"
          );
          e.target.parentElement.parentElement.className += " hide";
          this.gameState = 2;
        }
      });
    });

    document.getElementById("info").addEventListener("click", e => {
      if (document.getElementById("gameinfo").classList.contains("hide")) {
        document.getElementById("gameinfo").classList.remove("hide");
      }
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
    this.bgMusic.play();
    this.bgMusic.addEventListener("ended", e => {
      this.bgMusic.play();
    });

    this.setTimer();
    this.lives = 1;
    this.gameState = 1;
    this.ops = 400;
    this.pauseBTn.classList.remove("hide");
    this.score = 0;
    this.gameState = GAMESTATE.running;
  }

  update() {
    if (this.gameState != GAMESTATE.running) return;
    this.sumArea = 0;

    if (this.counter % this.spawnGap == 0) {
      this.bubbles.push(new Bubble(this));
      this.bubbles.push(new Bubble(this));
      this.bubbles.push(new Bubble(this));
      this.bubbles.push(new Bubble(this));
      this.spawnGap -= 2;
    }
    this.bubbles.forEach(bubble => {
      bubble.update(this);
    });
    this.bubbles = this.bubbles.filter(object => !object.markedForDeletion);
    this.bubbles.forEach(bubble => {
      this.sumArea += bubble.area;
    });

    if (this.sumArea >= 0.75 * this.gameArea) {
      if (this.time == 0) {
        this.gameState = GAMESTATE.gameover;
        this.gameOverSound.play();
        this.bgMusic.removeEventListener("ended", {});
        this.bgMusic.pause();
        this.updateScores();
      }
    } else {
      this.time = 10;
    }
    this.counter++;
  }
  draw(ctx) {
    if (this.gameState == GAMESTATE.menu) {
      return;
    }
    this.bubbles.forEach(bubble => {
      bubble.draw(ctx);
    });

    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    var highScore;
    if (localStorage.getItem("bubblescores") != null) {
      var scores = JSON.parse(localStorage.getItem("bubblescores"));
      highScore = scores[4];
    } else {
      highScore = 0;
    }
    ctx.fillText(`Current Score : ${this.score}`, 10, 40);

    if (
      this.time < 10 &&
      this.time > 0 &&
      this.sumArea >= 0.75 * this.gameArea
    ) {
      ctx.fillText(`Time Left: ${this.time}`, 10, 80);
      this.tickSound.play();
    }
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
    if (localStorage.getItem("bubblescores") != null) {
      scores = JSON.parse(localStorage.getItem("bubblescores"));
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
    if (localStorage.getItem("bubblescores") != null) {
      scores = JSON.parse(localStorage.getItem("bubblescores"));
    } else {
      scores = [0, 0, 0, 0, 0];
    }
    if (scores.length < 5) {
      for (var i = 0; i < 5 - scores.length; i++) {
        scores.push(0);
      }
    }

    for (var i = 4; i >= 0; i--) {
      if (scores[i] <= this.score) {
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
    localStorage.setItem("bubblescores", JSON.stringify(scores));
  }

  setTimer() {
    setInterval(() => {
      this.time--;
    }, 1000);
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
