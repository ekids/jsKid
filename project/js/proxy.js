let canvasSettings = {
  width: 900,
  height: 900,
  cellSize: 50
};

let app = new PIXI.Application({
  width: canvasSettings.width,
  height: canvasSettings.height,
  antialias: true,
  transparent: true,
  resolution: 1
});

let loader = PIXI.loader;
loader
  .add("./sprites/dungeon.json")
  .add("./sprites/heroes.json")
  .load(init);

let dungeonTextures;
let heroesTextures;

function CreateEntity(texture, type, x, y) {
  let entity = new PIXI.Sprite(texture);
  entity.x = x;
  entity.y = y;
  entity.step = 2;

  entity.spawn = function(cellY, cellX) {
    if (cellX >= 0) {
      this.x = cellX * canvasSettings.cellSize;
      this.cellX = cellX;
    } else {
      this.x = 0;
      this.cellX = 0;
    }
    if (cellY >= 0) {
      this.y = cellY * canvasSettings.cellSize;
      this.cellY = cellY;
    } else {
      this.y = 0;
      this.cellY = 0;
    }
    if (type !== undefined) {
      state.matrix[cellY][cellX] = {
        object: this,
        type: type
      };
    }
  };

  // matrix changes only when object arrives in next cell
  // before it object counts as in previous cell

  entity.moveLeft = function() {
    this.x -= this.step;
    if (!(this.x % canvasSettings.cellSize)) {
      this.cellX = this.x / canvasSettings.cellSize;
      this.prevDirection = "left";
      state.matrix[this.cellY][this.cellX] = {
        object: this,
        type: type
      };
      state.matrix[this.cellY][this.cellX + 1] = null;
    }
  };

  entity.moveRight = function() {
    this.x += this.step;
    if (!(this.x % canvasSettings.cellSize)) {
      this.cellX = this.x / canvasSettings.cellSize;
      this.prevDirection = "rigth";
      state.matrix[this.cellY][this.cellX] = {
        object: this,
        type: type
      };
      state.matrix[this.cellY][this.cellX - 1] = null;
    }
  };

  entity.moveUp = function() {
    this.y -= this.step;
    if (!(this.y % canvasSettings.cellSize)) {
      this.cellY = this.y / canvasSettings.cellSize;
      this.prevDirection = "up";
      state.matrix[this.cellY][this.cellX] = {
        object: this,
        type: type
      };
      state.matrix[this.cellY + 1][this.cellX] = null;
    }
  };

  entity.moveDown = function() {
    this.y += this.step;
    if (!(this.y % canvasSettings.cellSize)) {
      this.cellY = this.y / canvasSettings.cellSize;
      this.prevDirection = "down";
      state.matrix[this.cellY][this.cellX] = {
        object: this,
        type: type
      };
      state.matrix[this.cellY - 1][this.cellX] = null;
    }
  };

  // check surrounding cells

  entity.checkLeft = function() {
    let cell = state.matrix[this.cellY][this.cellX - 1];
    return cell && cell.type;
  };

  entity.checkRight = function() {
    let cell = state.matrix[this.cellY][this.cellX + 1];
    return cell && cell.type;
  };

  entity.checkUp = function() {
    let cell = state.matrix[this.cellY - 1][this.cellX];
    return cell && cell.type;
  };

  entity.checkDown = function() {
    let cell = state.matrix[this.cellY + 1][this.cellX];
    return cell && cell.type;
  };

  app.stage.addChild(entity);

  return entity;
}

function CreateHero(login) {
  return CreateEntity(heroesTextures[heroesMap[login]], "hero");
}

let elementsMap = {
  enemy: "ek_enemy_01.png",
  treasure: "ek_treasure_01.png",
  wall: "ek_wall_01.png"
};

function CreateElement(type) {
  return CreateEntity(dungeonTextures[elementsMap[type]], type);
}

function CreateMatrix() {
  let arr = [];
  for (
    let row = 0;
    row < canvasSettings.height / canvasSettings.cellSize;
    row++
  ) {
    arr[row] = [];
    for (
      let col = 0;
      col < canvasSettings.width / canvasSettings.cellSize;
      col++
    ) {
      arr[row][col] = null;
    }
  }
  return arr;
}

let state = {
  // matrix of objects 18x18
  matrix: CreateMatrix(),
  score: 0
};

function init() {
  dungeonTextures = loader.resources["./sprites/dungeon.json"].textures;
  heroesTextures = loader.resources["./sprites/heroes.json"].textures;

  let canvas = new PIXI.Sprite(dungeonTextures["ek_canvas_02.png"]);
  canvas.x = 0;
  canvas.y = 0;
  app.stage.addChild(canvas);

  // add walls into matrix: into first and last rows
  // we don't need define object instance bcs we will not manipulate with it (move, delete, etc.)
  for (let col = 0; col < state.matrix[0].length; col++) {
    state.matrix[0][col] = {
      type: "wall"
    };
    state.matrix[state.matrix.length - 1][col] = {
      type: "wall"
    };
  }

  // add walls into matrix: into first and last cols
  // we don't need define object instance bcs we will not manipulate with it (move, delete, etc.)
  for (let row = 1; row < state.matrix.length - 1; row++) {
    state.matrix[row][0] = {
      type: "wall"
    };
    state.matrix[row][state.matrix[0].length - 1] = {
      type: "wall"
    };
  }

  // setup for kids
  setup();

  app.ticker.add(delta => play(delta));
}

document.querySelector(".canvas").appendChild(app.view);
