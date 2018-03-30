//define alias for PIXI objects

let Application = PIXI.Application,
  Container = PIXI.Container,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  TextureCache = PIXI.utils.TextureCache,
  Sprite = PIXI.Sprite,
  Rectangle = PIXI.Rectangle;

//init constants
let gameInfo = {
  gameWidth: 512,
  gameHeight: 512
};

//init application
let app = new PIXI.Application({
  width: gameInfo.gameWidth,
  height: gameInfo.gameHeight,
  antialias: true,
  transparent: false,
  resolution: 1
});

loader.add("./sprites/treasureHunter.json").load(setup);

let dungeon,
  explorer,
  treasure,
  door,
  id,
  enemies = [],
  borders = { x: 28, y: 10, width: 488, height: 480 };

function CreateNewEntity(name, x, y) {
  let entity = new Sprite(id[name]);
  entity.x = x;
  entity.y = y;
  entity.step = 5;
  entity.horizontalDirection = 0;
  entity.verticalDirection = 0;
  app.stage.addChild(entity);

  return entity;
}

function FillBlobs(numberOfEnemy, xOffset, spacing) {
  //разместить капли на игровом поле
  let direction = 1;
  let speed = 2;

  for (let i = 0; i < numberOfEnemy; i++) {
    let x = spacing * i + xOffset;
    let y = randomInt(0, app.stage.height - 40);

    let enemy = Enemy("blob.png", x, y, direction, speed);

    direction *= -1;

    enemies.push(enemy);
  }
}

function isCollidedWith(sprite, container) {
  let collision = undefined;

  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = "left";
  }

  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = "top";
  }

  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision = "right";
  }

  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision = "bottom";
  }
  return collision;
}

function isCollidedWithObject(sprite, spriteObject) {
  let spriteBounds = sprite.getBounds();
  let objectBounds = spriteObject.getBounds();

  return (
    spriteBounds.x + spriteBounds.width > objectBounds.x &&
    spriteBounds.x < objectBounds.x + objectBounds.width &&
    spriteBounds.y + spriteBounds.height > objectBounds.y &&
    spriteBounds.y < objectBounds.y + objectBounds.height
  );
}

function setup() {
  id = resources["./sprites/treasureHunter.json"].textures;

  dungeon = CreateNewEntity("dungeon.png", 0, 0);

  let treasureX = gameInfo.gameWidth - 255;
  let treasureY = gameInfo.gameHeight / 2 - 55;
  treasure = CreateNewEntity("treasure.png", treasureX, treasureY);

  door = CreateNewEntity("door.png", 32, 0);

  FillBlobs(6, 150, 48);

  explorer = Hero("explorer.png", 136, 136);

  let gameTick = play;

  app.ticker.add(delta => gameTick(delta));
}

function keyboardcontroller(entity) {
  let left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);

  let toLeft = -1;
  let toRight = 1;
  let toUp = -1;
  let toDown = 1;
  let stop = 0;

  left.press = () => {
    entity.horizontalDirection = toLeft;
    entity.verticalDirection = stop;
  };

  left.release = () => {
    if (!right.isDown && entity.verticalDirection === stop) {
      entity.horizontalDirection = stop;
    }
  };

  up.press = () => {
    entity.verticalDirection = toUp;
    entity.horizontalDirection = stop;
  };

  up.release = () => {
    if (!down.isDown && entity.horizontalDirection === stop) {
      entity.verticalDirection = stop;
    }
  };

  right.press = () => {
    entity.horizontalDirection = toRight;
    entity.verticalDirection = stop;
  };

  right.release = () => {
    if (!left.isDown && entity.verticalDirection === stop) {
      entity.horizontalDirection = stop;
    }
  };

  down.press = () => {
    entity.verticalDirection = toDown;
    entity.horizontalDirection = stop;
  };

  down.release = () => {
    if (!up.isDown && entity.horizontalDirection === stop) {
      entity.verticalDirection = stop;
    }
  };
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function keyboard(keyCode) {
  let key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;

  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  window.addEventListener("keydown", key.downHandler.bind(key), false);
  window.addEventListener("keyup", key.upHandler.bind(key), false);
  return key;
}

document.querySelector(".canvas").appendChild(app.view);
