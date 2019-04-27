//Thought capital from https://gamedevacademy.org/how-to-make-a-mario-style-platformer-with-phaser-3/

import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import testJson from "./assets/test.json";
import testPng from "./assets/test.png";
import enemyImg from "./assets/enemy.jpg";
import arenaJson from "./assets/arena_data.json";
import arenaSheet from "./assets/arena_sheet.png";
import player from "./assets/player.png";

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

var scene;
var enemy;
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
  this.load.image('enemy', enemyImg);
}

function create() {
  scene = this;
  // this.cameras.main.setBounds(0, 0, 3392, 100);
  // this.physics.world.setBounds(0, 0, 3392, 240);

  buildMap();
  character = this.physics.add
    .image(400, 100, "player")
    .setCollideWorldBounds(true);
  character.depth = 1000;
  cursors = this.input.keyboard.createCursorKeys();
  wasd = this.input.keyboard.addKeys("W,A,S,D");
  this.cameras.main.startFollow(character, true, 0.08, 0.08);
  this.cameras.main.setZoom(3);

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

      var tile = scene.add.image(mapData.centerX + tx, mapData.centerY + ty, "tiles", id);

      tile.depth = mapData.centerY + ty;

      i++;
      var tile = scene.add.image(centerX + tx, centerY + ty, "arena", id);

      tile.depth = centerY + ty;
    }
  }
}

function update() {
  // return;
  enemy.setVelocity(0)
  if (d) {
    this.cameras.main.scrollX -= 0.5;
  }
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
