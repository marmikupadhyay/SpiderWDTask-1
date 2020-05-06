export default class Bubble {
  constructor(game) {
    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;
    this.popSound = document.getElementById("pop");
    this.popSound.volume = 0.35;
    this.radius = getRndInt(30, 60);
    var x = getRndInt(0, 4);
    if (game.score >= 1000) {
      this.type = x ? 1 : 0;
    } else {
      this.type = 1;
    }
    this.life = this.type ? 1 : 25;
    this.position = {
      x: getRndInt(this.radius, this.gameWidth - this.radius),
      y: getRndInt(this.radius, this.gameHeight - this.radius)
    };
    this.bubble = document.getElementById("bubble");
    this.maxSpeed = {
      x: getRndInt(2, 6),
      y: getRndInt(2, 6)
    };
    this.speed = {
      x: this.maxSpeed.x,
      y: this.maxSpeed.y
    };
    this.spawnProtection = 0;
    this.flag = 0;
    this.markedForDeletion = false;
    this.colorArray = [
      "#FF6633",
      "#FFB399",
      "#FF33FF",
      "#FFFF99",
      "#00B3E6",
      "#E6B333",
      "#3366E6",
      "#999966",
      "#99FF99",
      "#B34D4D",
      "#80B300",
      "#809900",
      "#E6B3B3",
      "#6680B3",
      "#66991A",
      "#FF99E6",
      "#CCFF1A",
      "#FF1A66",
      "#E6331A",
      "#33FFCC",
      "#66994D",
      "#B366CC",
      "#4D8000",
      "#B33300",
      "#CC80CC",
      "#66664D",
      "#991AFF",
      "#E666FF",
      "#4DB3FF",
      "#1AB399",
      "#E666B3",
      "#33991A",
      "#CC9999",
      "#B3B31A",
      "#00E680",
      "#4D8066",
      "#809980",
      "#E6FF80",
      "#1AFF33",
      "#999933",
      "#FF3380",
      "#CCCC00",
      "#66E64D",
      "#4D80CC",
      "#9900B3",
      "#E64D66",
      "#4DB380",
      "#FF4D4D",
      "#99E6E6",
      "#6666FF"
    ];
    this.game = game;
    this.dead = 0;
    this.color = this.colorArray[getRndInt(0, 49)];
    this.area = 4 * this.radius * this.radius;
    this.min = 30;
    this.max = 60;
    this.tries = 0;
    this.gauntlet = document.getElementById("gauntlet");
    this.width = 100;
    this.height = 100;
    var t = getRndInt(0, 20);
    this.type = t ? this.type : 2;
    if (this.type == 2) {
      console.log(1);
      this.speed = { x: 0, y: 0 };
      this.radius = this.width / 2;
      this.position = {
        x: this.gameWidth / 2,
        y: 0
      };
    } else {
      this.spawnCheck();
    }
  }
  draw(ctx) {
    if (this.radius < 0) return;
    if (this.type == 1) {
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    }
    if (this.type == 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(
        this.position.x,
        this.position.y,
        this.radius,
        0,
        Math.PI * 2,
        true
      );
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(
        this.bubble,
        this.position.x - this.radius,
        this.position.y - this.radius,
        this.radius * 2,
        this.radius * 2
      );
      ctx.beginPath();
      ctx.arc(
        this.position.x,
        this.position.y,
        this.radius,
        0,
        Math.PI * 2,
        true
      );
      ctx.clip();
      ctx.closePath();
      ctx.restore();
    }
    if (this.type == 2) {
      ctx.drawImage(
        this.gauntlet,
        this.position.x - this.width / 2,
        this.position.y - this.height / 2,
        this.width,
        this.height
      );
    }
  }
  update(game) {
    if (this.dead) {
      this.radius--;
    }
    if (game.counter % this.radius == 0) {
      this.color = this.colorArray[getRndInt(0, 49)];
    }
    this.flag = 0;
    if (this.spawnProtection == 1) {
      game.bubbles.forEach(bubble => {
        if (bubble != this) {
          if (
            Math.sqrt(
              Math.pow(bubble.position.x - this.position.x, 2) +
                Math.pow(bubble.position.y - this.position.y, 2)
            ) <=
            bubble.radius + this.radius
          ) {
            this.flag = 1;
          }
        }
      });
      if (this.flag != 1) {
        this.spawnProtection = 0;
      }
    }

    if (
      Math.sqrt(
        Math.pow(this.position.x - game.mouse.x, 2) +
          Math.pow(this.position.y - game.mouse.y, 2)
      ) <= this.radius
    ) {
      if (this.type == 2) {
        game.bubbles.forEach((bubble, index) => {
          if (index % 2 == 0) {
            bubble.die();
            game.score += bubble.radius;
          }
        });
        console.log(1);
      }
      if (game.mouseDown == 1) {
        this.life--;
      }
      if (this.life == 0) {
        this.die();
        game.score += this.radius;
      }
      this.popSound.play();
    }

    this.position.x += this.speed.x;
    this.position.y += this.speed.y;
    if (this.position.x - this.radius < 0) {
      this.speed.x *= -1;
      this.position.x = this.radius;
    }
    if (this.position.x + this.radius > this.gameWidth) {
      this.speed.x *= -1;
      this.position.x = this.gameWidth - this.radius;
    }
    if (this.position.y - this.radius < 0) {
      this.speed.y *= -1;
      this.position.y = this.radius;
    }
    if (this.position.y + this.radius > this.gameHeight) {
      this.speed.y *= -1;
      this.position.y = this.gameHeight - this.radius;
    }
    if (!this.spawnProtection) {
      game.bubbles.forEach(bubble => {
        if (bubble != this && bubble.type != 2) {
          this.checkCollision(bubble, this);
        }
      });
    }
  }

  checkCollision(obj1, obj2) {
    if (
      Math.sqrt(
        Math.pow(obj1.position.x - obj2.position.x, 2) +
          Math.pow(obj1.position.y - obj2.position.y, 2)
      ) <=
      obj1.radius + obj2.radius
    ) {
      obj2.speed.x *= -1;
      obj2.speed.y *= -1;
      obj2.position.x += obj2.speed.x;
      obj2.position.y += obj2.speed.y;
    }
  }

  die() {
    this.dead = 1;
    setTimeout(() => {
      this.markedForDeletion = true;
    }, 400);
  }

  spawnCheck() {
    if (this.tries > 100) {
      this.radius = 0;
      return;
    }
    this.tries++;
    this.game.bubbles.forEach(bubble => {
      if (bubble != this) {
        if (
          Math.sqrt(
            Math.pow(bubble.position.x - this.position.x, 2) +
              Math.pow(bubble.position.y - this.position.y, 2)
          ) <=
          bubble.radius + this.radius
        ) {
          this.radius = Math.floor(Math.random() * (30 + 1)) + 30;
          this.position = {
            x:
              Math.floor(
                Math.random() * (this.radius - this.gameWidth + this.radius + 1)
              ) +
              this.gameWidth -
              this.radius,
            y:
              Math.floor(
                Math.random() *
                  (this.radius - this.gameHeight + this.radius + 1)
              ) +
              this.gameHeight -
              this.radius
          };
          this.spawnCheck();
        }
      }
    });
  }
}
function getRndInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function customGetRndInt() {
  return Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
}
