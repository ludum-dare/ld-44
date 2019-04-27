import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import testJson from "./assets/test.json";
import testPng from "./assets/test.png";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create
  }
};

const game = new Phaser.Game(config);

var tileWidthHalf;
var tileHeightHalf;

var d = 0;

var scene;

function preload() {
  this.load.image("logo", logoImg);
  this.load.json("map", testJson);
  this.load.spritesheet("tiles", testPng, {
    frameWidth: 64,
    frameHeight: 64
  });
}

function create() {
  scene = this;
  buildMap();
  this.cameras.main.setSize(1600, 600);

  // this.cameras.main.scrollX = 800;
}

function buildMap() {
  //  Parse the data out of the map
  var data = scene.cache.json.get("map");

  var tilewidth = data.tilewidth;
  var tileheight = data.tileheight;

  tileWidthHalf = tilewidth / 2;
  tileHeightHalf = tileheight / 2;

  var layer = data.layers[0].data;

  var mapwidth = data.layers[0].width;
  var mapheight = data.layers[0].height;

  var centerX = mapwidth * tileWidthHalf;
  var centerY = 16;

  var i = 0;

  for (var y = 0; y < mapheight; y++) {
    for (var x = 0; x < mapwidth; x++) {
      var id = layer[i] - 1;

      var tx = (x - y) * tileWidthHalf;
      var ty = (x + y) * tileHeightHalf;

      var tile = scene.add.image(centerX + tx, centerY + ty, "tiles", id);

      tile.depth = centerY + ty;

      i++;
    }
  }
}

function update() {
  // return;

  if (d) {
    this.cameras.main.scrollX -= 0.5;

    if (this.cameras.main.scrollX <= 0) {
      d = 0;
    }
  } else {
    this.cameras.main.scrollX += 0.5;

    if (this.cameras.main.scrollX >= 800) {
      d = 1;
    }
  }
}
