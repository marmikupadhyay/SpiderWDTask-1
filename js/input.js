export default class InputHandler {
  constructor(game) {
    var rect = document.getElementById("game-screen").getBoundingClientRect();
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var rectPos = { y: rect.top + scrollTop, x: rect.left + scrollLeft };
    document.addEventListener("mousedown", event => {
      if (game.gameState == 3) window.location.reload();
      game.mouse.x = event.clientX - rectPos.x;
      game.mouse.y = event.clientY - rectPos.y;
      game.mouseDown++;
    });
    document.addEventListener("mouseup", event => {
      game.mouse.x = 0;
      game.mouse.y = 0;
      game.mouseDown = 0;
    });
    document.addEventListener("touchstart", event => {
      var touch = event.touches[0];
      if (game.gameState == 3) window.location.reload();
      game.mouse.x = touch.pageX - rectPos.x;
      game.mouse.y = touch.pageY - rectPos.y;
      game.mouseDown = true;
    });
    document.addEventListener("touchend", event => {
      game.mouse.x = 0;
      game.mouse.y = 0;
      game.mouseDown = false;
    });
  }
}
