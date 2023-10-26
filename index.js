const canvas = document.getElementById("canvas");

const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 568;

const gravity = 0.2;

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
  framesMax: 1,
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6,
});

const player = new Fighter({
  position: { x: 0, y: 100 },
  velocity: { x: 0, y: 0 },
  offSet: { x: 200, y: 154 },
  imageSrc: "./Martial Hero/Sprites/Idle.png",
  framesMax: 8,
  scale: 2.25,
  attackBox: {
    offSet: {
      x: 46,
      y: 50,
    },
    width: 180,
    height: 50,
  },
  sprites: {
    idle: {
      imageSrc: "./Martial Hero/Sprites/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./Martial Hero/Sprites/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./Martial Hero/Sprites/Jump.png",
      framesMax: 2,
    },
    death: {
      imageSrc: "./Martial Hero/Sprites/Death.png",
      framesMax: 6,
    },
    attack1: {
      imageSrc: "./Martial Hero/Sprites/Attack1.png",
      framesMax: 6,
    },
    fall: {
      imageSrc: "./Martial Hero/Sprites/Fall.png",
      framesMax: 2,
    },
    takeHit: {
      imageSrc: "./Martial Hero/Sprites/Take Hit.png",
      framesMax: 4,
    },
  },
});

const enemy = new Fighter({
  position: { x: 150, y: 100 },
  velocity: { x: 0, y: 0 },
  color: "blue",
  offSet: { x: 200, y: 166 },
  imageSrc: "./kenji/Idle.png",
  framesMax: 4,
  scale: 2.25,
  attackBox: {
    offSet: {
      x: -160,
      y: 50,
    },
    width: 160,
    height: 50,
  },
  sprites: {
    idle: {
      imageSrc: "./kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./kenji/Jump.png",
      framesMax: 2,
    },
    death: {
      imageSrc: "./kenji/Death.png",
      framesMax: 7,
    },
    attack1: {
      imageSrc: "./kenji/Attack1.png",
      framesMax: 4,
    },
    fall: {
      imageSrc: "./kenji/Fall.png",
      framesMax: 2,
    },
    takeHit: {
      imageSrc: "./kenji/Take Hit.png",
      framesMax: 3,
    },
  },
});

function loop() {
  requestAnimationFrame(loop);
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  shop.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  //player collision
  if (
    isColliding({ p1: player, p2: enemy }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    document.querySelector("#enemyHealth").style.width = `${enemy.health}%`;
    enemy.takeHit();
  }

  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  //enemy collision
  if (
    isColliding({ p1: enemy, p2: player }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    document.querySelector("#playerHealth").style.width = `${player.health}%`;
    enemy.isAttacking = false;
    player.takeHit();
  }

  if (player.health === 0 || enemy.health === 0) {
    determineWinner({ player, enemy, timerId });
  }
}

document.addEventListener("keydown", (event) => {
  console.log(event.key);

  switch (event.key) {
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "w":
      player.velocity.y = -8;
      break;

    case " ":
      player.attack();
      break;

    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowUp":
      enemy.velocity.y = -8;
      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
});

document.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      player.velocity.y = 0;
      break;

    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      enemy.velocity.x = 0;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      enemy.velocity.x = 0;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      enemy.velocity.y = 0;
      break;
  }
});

loop();
decreaseTimer();
