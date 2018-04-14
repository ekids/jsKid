// здесь объявляются объекты
var hero;
var enemy;
var treasure;

// здесь задается начальное положение объектов
// все, что написано здесь, выполняется 1 раз перед началом игры
// это отличное место, чтобы настроить ваше подземелье
function setup() {
  hero = CreateHero("Archer");
  hero.spawn(1, 1);

  treasure = CreateElement("treasure");
  treasure.spawn(8, 8);

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
}

// а здесь нужно писать поведение ваших объектов
// все проверки и действия, написанные здесь, выполняются каждый фрейм (60 раз в секунду)
function play(delta) {
  let targetPosition = { row: 8, col: 8 };
  let heroPosition = hero.getPosition();

  if (JSON.stringify(heroPosition) !== JSON.stringify(targetPosition)) {
    if (hero.lookRight() && hero.lookRight().type === "treasure") {
      hero.moveRight();
    } else if (hero.checkDown() !== "wall" && hero.direction === "down") {
      // хаотичное передвижение
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
