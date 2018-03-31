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
  
  for (let i = 0; i < 18; i++) {
    let wall = CreateElement("wall");
    wall.spawn(i, 2);
  }
}

// а здесь нужно писать поведение ваших объектов
// все проверки и действия, написанные здесь, выполняются каждый фрейм (60 раз в секунду)
function play(delta) {
  
}
