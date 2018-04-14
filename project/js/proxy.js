let canvasSettings = {
  sizeInPixels: 700,
  squaresCount: 18
};

canvasSettings.cellSize =
  canvasSettings.sizeInPixels / canvasSettings.squaresCount;

let app = new PIXI.Application({
  width: canvasSettings.sizeInPixels,
  height: canvasSettings.sizeInPixels,
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
  entity.scale.x = canvasSettings.scale;
  entity.scale.y = canvasSettings.scale;
  entity.step = 2;

  entity.spawn = function(row, column) {
    if (column >= 0) {
      this.x = column * canvasSettings.cellSize;
      this.column = column;
    } else {
      this.x = 0;
      this.column = 0;
    }
    if (row >= 0) {
      this.y = row * canvasSettings.cellSize;
      this.row = row;
    } else {
      this.y = 0;
      this.row = 0;
    }
    if (type !== undefined) {
      state.matrix[row][column] = {
        object: this,
        type: type
      };
    }

    entity.chooseDirection();
  };

  // matrix changes only when object arrives in next cell
  // before it object counts as in previous cell

  entity.moveLeft = function() {
    this.x -= this.step;
    let column = Math.ceil(this.x / canvasSettings.cellSize);
    if (this.column !== column) {
      this.column = column;
      state.matrix[this.row][this.column] = {
        object: this,
        type: type
      };
      state.matrix[this.row][this.column + 1] = null;
    }
    this.direction = "left";
  };

  entity.moveRight = function() {
    this.x += this.step;
    let column = Math.floor(this.x / canvasSettings.cellSize);
    if (this.column !== column) {
      this.column = column;
      state.matrix[this.row][this.column] = {
        object: this,
        type: type
      };
      state.matrix[this.row][this.column - 1] = null;
    }
    this.direction = "right";
  };

  entity.moveUp = function() {
    this.y -= this.step;
    let row = Math.ceil(this.y / canvasSettings.cellSize);
    if (this.row !== row) {
      this.row = row;
      state.matrix[this.row][this.column] = {
        object: this,
        type: type
      };
      state.matrix[this.row + 1][this.column] = null;
    }
    this.direction = "up";
  };

  entity.moveDown = function() {
    this.y += this.step;
    let row = Math.floor(this.y / canvasSettings.cellSize);
    if (this.row !== row) {
      this.row = row;
      state.matrix[this.row][this.column] = {
        object: this,
        type: type
      };
      state.matrix[this.row - 1][this.column] = null;
    }
    this.direction = "down";
  };

  // look directly through several cells

  entity.lookHorizontal = function(direction) {
    let predicate = item =>
      item !== null &&
      item.type &&
      item.type !== "wall" &&
      item.type !== "hero";

    let rowArray = state.matrix[this.row];

    let target = rowArray.find(predicate);
    if (target === undefined) {
      return null;
    }

    let targetCol = rowArray.findIndex(predicate);

    let pathArray =
      direction === "right"
        ? rowArray.slice(this.col, targetCol - this.col)
        : direction === "left"
          ? rowArray.slice(targetCol, this.col - targetCol)
          : rowArray;

    let isClear = !pathArray.find(item => item.type === "wall");
    if (isClear) {
      return {
        row: this.row,
        col: targetCol,
        type: target && target.type
      };
    }
  };

  entity.lookRight = function() {
    return this.lookHorizontal("right");
  };

  entity.lookLeft = function() {
    return this.lookHorizontal("left");
  };

  entity.lookVertical = function(direction) {
    let predicate = item =>
      item !== null &&
      item.type &&
      item.type !== "wall" &&
      item.type !== "hero";

    let columnArray = [];
    for (let i = 0; i < state.matrix.length; i++) {
      columnArray.push(state.matrix[i][this.col]);
    }

    let target = columnArray.find(predicate);
    if (target === undefined) {
      return null;
    }

    let targetRow = columnArray.findIndex(predicate);

    let pathArray =
      direction === "down"
        ? columnArray.slice(this.row, targetRow - this.row)
        : direction === "up"
          ? columnArray.slice(targetRow, this.row - targetRow)
          : columnArray;

    let isClear = !pathArray.find(item => item.type === "wall");
    if (isClear) {
      return {
        row: targetRow,
        col: this.col,
        type: target && target.type
      };
    }
  };

  entity.lookDown = function() {
    return this.lookVertical("down");
  };

  entity.lookUp = function() {
    return this.lookVertical("up");
  };

  entity.chooseDirection = function() {
    let items = [];
    if (hero.checkLeft() !== "wall") {
      items.push("left");
    }
    if (hero.checkRight() !== "wall") {
      items.push("right");
    }
    if (hero.checkDown() !== "wall") {
      items.push("down");
    }
    if (hero.checkUp() !== "wall") {
      items.push("up");
    }

    let prevDirection = hero.direction;
    let directionMap = {
      left: "right",
      right: "left",
      up: "down",
      down: "up"
    };

    let counterDirectionIndex = items.indexOf(directionMap[prevDirection]);
    if (items.length > 1 && counterDirectionIndex !== -1) {
      items.splice(counterDirectionIndex, 1);
    }

    hero.direction = items[Math.floor(Math.random() * items.length)];
  };

  // check surrounding cells

  entity.checkLeft = function() {
    let cell = state.matrix[this.row][this.column - 1];
    return cell && cell.type;
  };

  entity.checkRight = function() {
    let cell = state.matrix[this.row][this.column + 1];
    return cell && cell.type;
  };

  entity.checkUp = function() {
    let cell = state.matrix[this.row - 1][this.column];
    return cell && cell.type;
  };

  entity.checkDown = function() {
    let cell = state.matrix[this.row + 1][this.column];
    return cell && cell.type;
  };

  entity.getPosition = function() {
    // TODO: check only if int coords
    for (let row = 0; row < state.matrix.length; row++) {
      for (let col = 0; col < state.matrix.length; col++) {
        let cell = state.matrix[row][col];
        if (cell && cell.type === "hero") {
          return { row, col };
        }
      }
    }
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
  for (let row = 0; row < canvasSettings.squaresCount; row++) {
    arr[row] = [];
    for (let col = 0; col < canvasSettings.squaresCount; col++) {
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
  canvasSettings.scale = canvasSettings.sizeInPixels / canvas.width;
  canvas.scale.x = canvasSettings.scale;
  canvas.scale.y = canvasSettings.scale;
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
