//Thought capital from https://gamedevacademy.org/how-to-make-a-mario-style-platformer-with-phaser-3/

import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import enemyImg from "./assets/enemy.jpg";
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

  this.load.audio("song_1", songOne);
  this.load.image('enemy', enemyImg);
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
  
  // this.cameras.main.scrollX = 800;
  // Add the enemy
  enemy = this.physics.add.sprite(200, 200, 'enemy')
  enemy.setBounce(0.2)
  enemy.setVelocityX(100)
  enemy.setCollideWorldBounds(true); // don't go out of the map
  enemy.depth = 100000;
}

/**
 * Function that returns all the attributes about the map that you could possibly need
 */
function getMapInfo() {
  var data = scene.cache.json.get("map");
  var mapData = {
    tileWidth : data.tile_width,
    tileHeight : data.tile_height,
    layer : data.layers[0].data,
    mapWidth : data.width, // Width of the entire map
    mapHeight : data.height, // Height of the entire map
    centerX : data.width * data.tile_width / 2,
    centerY : 16,

  }
  return mapData
}

function buildMap() {
  //  Parse the data out of the map
  var mapData = getMapInfo()
  //console.log(mapData)

  for (var y = 0; y < mapData.mapHeight; y++) {
    for (var x = 0; x < mapData.mapWidth; x++) {
      var id = mapData.layer[x][y];

      var tx = (x - y) * (mapData.tileWidth / 2);
      var ty = (x + y) * (mapData.tileHeight / 4);

      var tile = scene.add.image(mapData.centerX + tx, mapData.centerY + ty, "arena", id);

      tile.depth = mapData.centerY + ty;
    }
  }
}

function characterMotion() {
   // Horizontal motion for player
   if (wasd.A.isDown) {
    character.setVelocityX(-200);
  } 
  else if (wasd.D.isDown) {
    character.setVelocityX(200);
  }
  // Horizontal check for stop
  if (wasd.A.isUp && wasd.D.isUp) {
    character.setVelocityX(0)
  }
  // Vertical motion for player
  if (wasd.W.isDown) {
    wasd.A.isDown || wasd.D.isDown
      ? character.setVelocityY(-100)
      : character.setVelocityY(-200);
  }
  else if (wasd.S.isDown) {
    wasd.A.isDown || wasd.D.isDown
      ? character.setVelocityY(100)
      : character.setVelocityY(200);
  }
  // Vertical check for stop
  if (wasd.W.isUp && wasd.S.isUp) {
    character.setVelocityY(0);
  }
}

function enemyMotion() {
  // enemy.velocity.x
  if (enemy.x < 100) {
    enemy.setVelocityX(100) 
  }
  if (enemy.x > 1000) {
    enemy.setVelocityX(-100)
  }
}
function update() {
  //enemy.setVelocity(0)
  characterMotion()
  enemyMotion()
  // var enemyX = -100
  
  // if (enemy.x < 100) {
  //   enemyX = 100
  // }
  // if (enemy.x > 1000) {
  //   enemyX = -100
  // }
  // enemy.setAngle(-90).setVelocityX(-200);
  // enemy.setVelocityY(-100);

}
