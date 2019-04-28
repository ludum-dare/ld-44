//Thought capital from https://gamedevacademy.org/how-to-make-a-mario-style-platformer-with-phaser-3/

import Phaser from "phaser";
import IsoPlugin, { IsoPhysics } from "phaser3-plugin-isometric";
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
  scene: {
    preload: preload,
    create: create,
    update: update,
    mapAdd: { isoPlugin: "iso", isoPhysics: "isoPhysics" }
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
  this.load.image("enemy", enemyImg);
  this.load.scenePlugin({
    key: "IsoPlugin",
    url: IsoPlugin,
    sceneKey: "iso"
  });

  this.load.scenePlugin({
    key: "IsoPhysics",
    url: IsoPhysics,
    sceneKey: "isoPhysics"
  });
}

function create() {
  scene = this;
  
  this.isoGroup = this.add.group();
  this.isoPhysics.projector.origin.setTo(0.5, 0.3);

  buildMap();
  character = this.add.isoSprite(0, 0, 0, "player", this.isoGroup);

  this.isoPhysics.world.enable(character);
  character.body.collideWorldBounds = true;
  cursors = this.input.keyboard.createCursorKeys();
  wasd = this.input.keyboard.addKeys("W,A,S,D");
  this.cameras.main.startFollow(character, true, 0.08, 0.08);
  this.cameras.main.setZoom(2);

  const musicConf = { loop: true, delay: 0 };
  var music = this.sound.add("song_1", musicConf);
  music.play();

  // this.cameras.main.scrollX = 800;
  // Add the enemy
  enemy = this.add.isoSprite(200, 200, 0, "enemy", this.isoGroup);
  this.isoPhysics.world.enable(enemy);
  enemy.body.collideWorldBounds = true;
}

/**
 * Function that returns all the attributes about the map that you could possibly need
 */
function getMapInfo() {
  var data = scene.cache.json.get("map");
  var mapData = {
    tileWidth: data.tile_width,
    tileHeight: data.tile_height,
    layer: data.layers[0].data,
    mapWidth: data.width, // Width of the entire map
    mapHeight: data.height, // Height of the entire map
  };
  return mapData;
}

function buildMap() {
  //  Parse the data out of the map
  var mapData = getMapInfo();
  scene.isoPhysics.world.setBounds(0, 0, 0, mapData.mapHeight * mapData.tileHeight, mapData.mapWidth * mapData.tileWidth, 250)

  for (var x = 0; x < mapData.mapHeight; x++) {
    for (var y = 0; y < mapData.mapWidth; y++) {
      var id = mapData.layer[x][y];

      var tx = x * mapData.tileWidth
      var ty = y * mapData.tileHeight

      var tile = scene.add.isoSprite(tx, ty, 0, "arena");
    }
  }
}

function characterMotion() {
  // Horizontal motion for player
  if (wasd.A.isDown) {
    character.body.velocity.x = -200;
  } else if (wasd.D.isDown) {
    character.body.velocity.x = 200;
  }
  // Horizontal check for stop
  if (wasd.A.isUp && wasd.D.isUp) {
    character.body.velocity.x = 0;
  }
  // Vertical motion for player
  if (wasd.W.isDown) {
    character.body.velocity.y = -200;
  } else if (wasd.S.isDown) {
    character.body.velocity.y = 200;
  }
  // Vertical check for stop
  if (wasd.W.isUp && wasd.S.isUp) {
    character.body.velocity.y = 0;
  }
}

function enemyMotion() {
  // enemy.velocity.x
  if (enemy.x < 100) {
    enemy.velocity.x = 100;
  }
  if (enemy.x > 1000) {
    enemy.velocity.x = -100;
  }
}
function update() {
  //enemy.setVelocity(0)
  this.isoPhysics.world.collide(this.isoGroup);
  characterMotion();
  enemyMotion();
}
