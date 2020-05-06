import Game from "../js/game.js";

var w =
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

var h =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;
if (w > 600) {
  var GAME_WIDTH = w / 2;
  var GAME_HEIGHT = 700;
} else {
  var GAME_WIDTH = w;
  var GAME_HEIGHT = h;
}
var canvas = document.getElementById("game-screen");
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
var menus = document.querySelectorAll(".menu");
menus.forEach(menu => {
  menu.style.width = GAME_WIDTH + "px";
  if (w > 600) {
    menu.style.height = GAME_HEIGHT + "px";
  }
});
var ctx = canvas.getContext("2d");

var game = new Game(GAME_WIDTH, GAME_HEIGHT);

function gameLoop(timeStamp) {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  game.draw(ctx);
  game.update();
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
