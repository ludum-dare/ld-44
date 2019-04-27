//Thought capital from https://gamedevacademy.org/how-to-make-a-mario-style-platformer-with-phaser-3/

import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import testJson from "./assets/test.json";
import testPng from "./assets/test.png";
import enemyImg from "./assets/enemy.jpg";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics: { 
    default: 'arcade' //,
  //   arcade: {
  //     gravity: { y: 500 }, // will affect our player sprite
  //     debug: false // change if you need
  //   }
  }
};

const game = new Phaser.Game(config);

var tileWidthHalf;
var tileHeightHalf;

var d = 0;

var scene;
var enemy;

function preload() {
  this.load.image("logo", logoImg);
  this.load.json("map", testJson);
  this.load.spritesheet("tiles", testPng, {
    frameWidth: 64,
    frameHeight: 64
  });
  this.load.image('enemy', enemyImg);
}

function create() {
  scene = this;
  buildMap();
  this.cameras.main.setSize(1600, 600);

  // this.cameras.main.scrollX = 800;
  // Add the enemy
  enemy = this.physics.add.sprite(200, 200, 'enemy')
  enemy.setBounce(0.2)
  enemy.setCollideWorldBounds(true); // don't go out of the map
  enemy.depth = 100000;
}

/**
 * Function that returns all the attributes about the map that you could possibly need
 */
function getMapInfo() {
  var data = scene.cache.json.get("map");
  var mapData = {
    tileWidth : data.tilewidth,
    tileHeight : data.tileheight,
    layer : data.layers[0].data,
    mapWidth : data.layers[0].width, // Width of the entire map
    mapHeight : data.layers[0].height, // Height of the entire map
    centerX : data.layers[0].width * data.tilewidth / 2,
    centerY : 16,

  }
  return mapData
}

function buildMap() {
  //  Parse the data out of the map
  var mapData = getMapInfo()
  //console.log(mapData)
  tileWidthHalf = mapData.tileWidth / 2;
  tileHeightHalf = mapData.tileHeight / 2;

  var i = 0;

  for (var y = 0; y < mapData.mapHeight; y++) {
    for (var x = 0; x < mapData.mapWidth; x++) {
      var id = mapData.layer[i] - 1;

      var tx = (x - y) * tileWidthHalf;
      var ty = (x + y) * tileHeightHalf;

      var tile = scene.add.image(mapData.centerX + tx, mapData.centerY + ty, "tiles", id);

      tile.depth = mapData.centerY + ty;

      i++;
    }
  }
}

function update() {
  // return;
  enemy.setVelocity(0)
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
  var enemyX = -100
  
  if (enemy.x < 100) {
    enemyX = 100
  }
  if (enemy.x > 1000) {
    enemyX = -100
  }
  enemy.setAngle(-90).setVelocityX(-200);
  enemy.setVelocityY(-100);

}
