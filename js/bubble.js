export default class Bubble {
  constructor(game) {
    this.gameWidth = game.gameWidth;
    this.gameHeight = game.gameHeight;
    this.popSound = document.getElementById("pop");
    this.radius = getRndInt(30, 60);
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
    // this.spawnProtection(game);
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
    this.color = this.colorArray[getRndInt(0, 49)];
    this.area = Math.PI * this.radius * this.radius;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    // ctx.save();
    // ctx.beginPath();
    // ctx.arc(
    //   this.position.x,
    //   this.position.y,
    //   this.radius,
    //   0,
    //   Math.PI * 2,
    //   true
    // );
    // ctx.closePath();
    // ctx.clip();
    // ctx.drawImage(
    //   this.bubble,
    //   this.position.x - this.radius,
    //   this.position.y - this.radius,
    //   this.radius * 2,
    //   this.radius * 2
    // );
    // ctx.beginPath();
    // ctx.arc(
    //   this.position.x,
    //   this.position.y,
    //   this.radius,
    //   0,
    //   Math.PI * 2,
    //   true
    // );
    // ctx.clip();
    // ctx.closePath();
    // ctx.restore();
  }
  update(game) {
    if (
      Math.sqrt(
        Math.pow(this.position.x - game.mouse.x, 2) +
          Math.pow(this.position.y - game.mouse.y, 2)
      ) <= this.radius
    ) {
      this.markedForDeletion = true;
      this.popSound.play();
      game.score += this.radius;
      console.log(1);
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

    game.bubbles.forEach(bubble => {
      if (bubble != this) {
        this.checkCollision(bubble, this);
      }
    });
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

  spawnProtection(game) {
    game.bubbles.forEach(bubble => {
      if (bubble != this) {
        if (
          Math.sqrt(
            Math.pow(bubble.position.x - this.position.x, 2) +
              Math.pow(bubble.position.y - this.position.y, 2)
          ) <=
          bubble.radius + this.radius
        ) {
          this.position = {
            x: getRndInt(this.radius, this.gameWidth - this.radius),
            y: getRndInt(this.radius, this.gameHeight - this.radius)
          };
          this.spawnProtection(game);
        }
      }
    });
  }
}
function getRndInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
