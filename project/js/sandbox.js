// здесь объявляются объекты
var hero;
var treasure;
var enemy;

// здесь задается начальное положение объектов
// все, что написано здесь, выполняется 1 раз перед началом игры
// это отличное место, чтобы настроить ваше подземелье
function setup() {
  hero = CreateHero("Archer");
  hero.spawn(1, 1);

  treasure = CreateElement("treasure");
  treasure.spawn(16, 15);

  enemy = CreateElement("enemy");
  enemy.spawn(16, 16);

  for (let i = 0; i < 6; i++) {
    let wall = CreateElement("wall");
    wall.spawn(2, i);
  }

  for (let i = 0; i < 3; i++) {
    let wall = CreateElement("wall");
    wall.spawn(i, 7);
  }

  for (let i = 3; i < 12; i++) {
    let wall = CreateElement("wall");
    wall.spawn(4, i);
  }

  for (let i = 0; i < 5; i++) {
    let wall = CreateElement("wall");
    wall.spawn(i, 10);
  }
  console.log(state.matrix);
}

// а здесь нужно писать поведение ваших объектов
// все проверки и действия, написанные здесь, выполняются каждый фрейм (60 раз в секунду)
function play(delta) {
  if (
    JSON.stringify(hero.getPosition()) !== JSON.stringify({ row: 1, col: 5 })
  ) {
    if (hero.checkDown() !== "wall" && hero.direction === "down") {
      hero.moveDown();
    } else if (hero.checkRight() !== "wall" && hero.direction === "right") {
      hero.moveRight();
    } else if (hero.checkLeft() !== "wall" && hero.direction === "left") {
      hero.moveLeft();
    } else if (hero.checkUp() !== "wall" && hero.direction === "up") {
      hero.moveUp();
    } else {
      hero.chooseDirection();
    }
  }
}
