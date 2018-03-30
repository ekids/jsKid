// здесь объявляются объекты
var hero;
var treasure;
var enemy;

// здесь задается начальное положение объектов
// все, что написано здесь, выполняется 1 раз перед началом игры
// это отличное место, чтобы настроить ваше подземелье
function setup() {
  wall = CreateElement("wall");
  wall.spawn(2, 1);
  wall = CreateElement("wall");
  wall.spawn(2, 2);

  for (let i = 3; i < 16; i++) {
    wall = CreateElement("wall");
    wall.spawn(2, i);
  }

  for (let i = 2; i < 17; i++) {
    wall = CreateElement("wall");
    wall.spawn(4, i);
  }

  hero = CreateHero("hero1");
  hero.spawn(1, 1);

  treasure = CreateElement("treasure");
  treasure.spawn(16, 15);

  enemy = CreateElement("enemy");
  enemy.spawn(16, 16);
}

// а здесь нужно писать поведение ваших объектов
// все проверки и действия, написанные здесь, выполняются каждый фрейм (60 раз в секунду)
function play(delta) {
  if (hero.checkRight() !== "wall") {
    hero.moveRight();
  } else if (hero.checkDown() !== "wall") {
    hero.moveDown();
  } else if (
    hero.checkLeft() !== "wall" &&
    (hero.prevDirection === "left" || hero.prevDirection === "down")
  ) {
    hero.moveLeft();
  } else if (hero.checkUp() !== "wall") {
    hero.moveUp();
  }

  console.log(
    hero.cellX,
    hero.cellY,
    hero.checkLeft(),
    hero.checkRight(),
    hero.checkUp(),
    hero.checkDown()
  );
}
