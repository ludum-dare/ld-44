import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import arenaJson from "./assets/arena_data.json";
import arenaSheet from "./assets/arena_sheet.png";
import ship from "./assets/fmship.png";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  physics: {
    default: "arcade"
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

var tileWidthHalf;
var tileHeightHalf;

var scene;
var character;
var cursors;

function preload() {
  this.load.image("logo", logoImg);

  this.load.json("map", arenaJson);
  this.load.image("ship", ship);
  this.load.spritesheet("arema", arenaSheet, {
    frameWidth: 64,
    frameHeight: 64
  });
}

function create() {
  scene = this;
  // this.cameras.main.setBounds(0, 0, 3392, 100);
  // this.physics.world.setBounds(0, 0, 3392, 240);

  buildMap();
  character = this.physics.add
    .image(400, 100, "ship")
    .setAngle(90)
    .setCollideWorldBounds(true);
  character.depth = 1000;
  cursors = this.input.keyboard.createCursorKeys();
  this.cameras.main.startFollow(character, true, 0.08, 0.08);
  this.cameras.main.setZoom(3);

  // this.cameras.main.scrollX = 800;
}

function buildMap() {
  //  Parse the data out of the map
  var data = scene.cache.json.get("map");

  var tilewidth = data.tile_width;
  var tileheight = data.tile_height;

  var layer = data.layers[0].data;

  var mapwidth = data.width;
  var mapheight = data.height;

  var centerX = mapwidth * (tilewidth / 2);
  var centerY = 16;

  for (var y = 0; y < mapheight; y++) {
    for (var x = 0; x < mapwidth; x++) {
      var id = layer[x][y];

      var tx = (x - y) * (tilewidth / 2);
      var ty = (x + y) * (tileheight / 4);

      var tile = scene.add.image(centerX + tx, centerY + ty, "arena", id);

      tile.depth = centerY + ty;
    }
  }
}

function update() {
  character.setVelocity(0);

  if (cursors.left.isDown) {
    character.setAngle(-90).setVelocityX(-200);
    character.setVelocityY(-100);
  } else if (cursors.right.isDown) {
    character.setAngle(90).setVelocityX(200);
    character.setVelocityY(100);
  }

  if (cursors.up.isDown) {
    character.setAngle(0).setVelocityX(200);
    character.setVelocityY(-100);
  } else if (cursors.down.isDown) {
    character.setAngle(0).setVelocityX(-200);
    character.setVelocityY(100);
  }
}
