let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle;

let app = new PIXI.Application({
    width: 640,
    height: 480,
    antialias: true,
    transparent: false, 
    resolution: 1
});
loader
  .add("./images/treasureHunter.json")
  .load(setup);

let dungeon, explorer, treasure, door, id;

function setup() {
  id = resources["./images/treasureHunter.json"].textures;
  
  let dungeonTexture = TextureCache["dungeon.png"];
  dungeon = new Sprite(dungeonTexture);
  app.stage.addChild(dungeon);

  treasure = new Sprite(id["treasure.png"]);
  treasure.x = app.stage.width - treasure.width - 48;
  treasure.y = app.stage.height / 2 - treasure.height / 2;
  app.stage.addChild(treasure);

  door = new Sprite(id["door.png"]); 
  door.position.set(32, 0);
  app.stage.addChild(door);

  let numberOfBlobs = 6,
      spacing = 48,
      xOffset = 150;

   for (let i = 0; i < numberOfBlobs; i++) {

     let blob = new Sprite(id["blob.png"]);
     let x = spacing * i + xOffset;
     let y = randomInt(0, app.stage.height - blob.height);
     blob.x = x;
     blob.y = y;
     app.stage.addChild(blob);
   }

   function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
    let explorer = new Sprite(id["explorer.png"]);
    explorer.x = 136;
    explorer.y = 136;

    app.stage.addChild(explorer);
}
document.body.appendChild(app.view);