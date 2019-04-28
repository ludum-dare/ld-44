import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import arenaJson from "./assets/arena_data.json";
import arenaSheet from "./assets/arena_sheet.png";
import player from "./assets/player.png";
import songOne from "./assets/song_1.ogg";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  pixelArt: true,
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
var wasd;

function preload() {
  this.load.image("logo", logoImg);

  this.load.json("map", arenaJson);
  this.load.image("player", player);
  this.load.spritesheet("arena", arenaSheet, {
    frameWidth: 64,
    frameHeight: 64
  });

  this.load.audio("song_1", songOne);
}

function create() {
  scene = this;
  // this.cameras.main.setBounds(0, 0, 3392, 100);
  // this.physics.world.setBounds(0, 0, 3392, 240);

  buildMap();
  character = this.physics.add
    .image(800, 300, "player")
    .setCollideWorldBounds(true);
  character.depth = 1000;
  cursors = this.input.keyboard.createCursorKeys();
  wasd = this.input.keyboard.addKeys("W,A,S,D");
  this.cameras.main.startFollow(character, true, 0.08, 0.08);
  this.cameras.main.setZoom(2);

  const musicConf = { loop: true, delay: 0 }
  var music = this.sound.add("song_1", musicConf);
  music.play();
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

  if (wasd.A.isDown) {
    character.setVelocityX(-200);
  } else if (wasd.D.isDown) {
    character.setVelocityX(200);
  }

  if (wasd.W.isDown) {
    wasd.A.isDown || wasd.D.isDown
      ? character.setVelocityY(-100)
      : character.setVelocityY(-200);
  } else if (wasd.S.isDown) {
    wasd.A.isDown || wasd.D.isDown
      ? character.setVelocityY(100)
      : character.setVelocityY(200);
  }
}
