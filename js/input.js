export default class InputHandler {
  constructor(game) {
    document.addEventListener("keypress", event => {
      switch (event.keyCode) {
        case 32:
          game.ball.speed.y = -game.ball.jumpHeight;
          game.jumpSound.play();
          if (game.ball.position.y < game.ball.gameHeight / 2) {
            game.obstacles.forEach(obstacle => {
              obstacle.speed.y = 4;
            });
            game.collectibles.forEach(collectible => {
              collectible.speed.y = 4;
            });
          }
          break;
      }
    });

    document.addEventListener("click", event => {
      game.ball.speed.y = -game.ball.jumpHeight;
      game.jumpSound.play();
      if (game.ball.position.y < game.ball.gameHeight / 2) {
        game.obstacles.forEach(obstacle => {
          obstacle.speed.y = 4;
        });
        game.collectibles.forEach(collectible => {
          collectible.speed.y = 4;
        });
      }
    });

    document.addEventListener("dblclick", e => {
      if (game.gameState == 3) {
        game.gameState = 1;
        game.start();
        console.log(1);
        location.reload();
      }
    });

    document.addEventListener("keyup", event => {
      switch (event.keyCode) {
      }
    });
  }
}
