function isColliding({ p1, p2 }) {
  return (
    p1.attackBox.position.x + p1.attackBox.width >= p2.position.x &&
    p1.attackBox.position.x <= p2.position.x + p2.width &&
    p1.attackBox.position.y + p1.attackBox.height >= p2.position.y &&
    p1.attackBox.position.y <= p2.position.y + p2.height
  );
}

let timer = 100;
let timerId;

function decreaseTimer() {
  if (timer > 0) {
    --timer;
    document.querySelector("#timer").innerHTML = timer;
    timerId = setTimeout(decreaseTimer, 1000);
  }

  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector("#displayText").style.display = "flex";
  if (player.health === enemy.health) {
    document.querySelector("#displayText").innerHTML = "Draw";
  } else if (player.health > enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player 1 Win!";
  } else if (player.health < enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player 2 Win!";
  }
}
