//Thought capital from https://gamedevacademy.org/how-to-make-a-mario-style-platformer-with-phaser-3/

import Phaser from "phaser";
import logoImg from "./assets/logo.png";
import enemyOne from "./assets/enemy1.png";
import arenaJson from "./assets/arena_data.json";
import arenaSheet from "./assets/arena_sheet.png";
import player from "./assets/player.png";
import songOne from "./assets/song_1.ogg";
import orbImg from "./assets/orb.png";
import Hud from "./hud.js";
import BloodOrb from "./blood_orb.js";

const hud = new Hud();

const config = {
  type: Phaser.AUTO,
  parent: "content",
  width: 800,
  height: 600,
  pixelArt: true,
  physics: {
    default: "arcade"
  },
  scene: [
    {
      preload: preload,
      create: create,
      update: update
    },
    hud
  ]
};

const game = new Phaser.Game(config);

var tileWidthHalf;
var tileHeightHalf;

var scene;
var enemy;
var enemy2;
var initialEnemies;
var enemyGroup;
var character;
var bounds;
var cursors;
var wasd;
const numEnemiesStart = 2;
var combatKeys;
var orbs;
var justShot;
var swinging;
var bloodGroup;

function preload() {
  this.load.image("logo", logoImg);

  this.load.json("map", arenaJson);
  this.load.spritesheet("player", player, {
    frameWidth: 48,
    frameHeight: 36
  });
  this.load.spritesheet("arena", arenaSheet, {
    frameWidth: 64,
    frameHeight: 64
  });

  this.load.audio("song_1", songOne);
  this.load.image("enemy_1", enemyOne);
  this.load.image("blood_orb", orbImg);
}

function create() {
  scene = this;
  bounds = scene.physics.add.staticGroup();
  buildMap();
  character = this.physics.add
    .image(800, 300, "player", 0)
    .setCollideWorldBounds(true);
  character.depth = 1000;
  cursors = this.input.keyboard.createCursorKeys();
  wasd = this.input.keyboard.addKeys("W,A,S,D");
  combatKeys = this.input.keyboard.addKeys("O,P");
  this.cameras.main.startFollow(character, true, 0.08, 0.08);
  this.cameras.main.setZoom(2);

  bloodGroup = this.physics.add.group();

  const musicConf = { loop: true, delay: 0 }
  var music = this.sound.add("song_1", musicConf);
  music.play();
  enemyGroup = this.physics.add.group({
    bounceX: 1,
    bounceY: 1,
    collideWorldBounds:true
  })
  // this.cameras.main.scrollX = 800;
  // Add the enemy
  initialEnemies = []
  for (var i = 0; i < numEnemiesStart; i++) {
    var anEnemy = this.physics.add.sprite(400 + (Math.random() * 75), 400 + (Math.random() * 75), 'enemy_1')
    anEnemy.tick = 0
    anEnemy.health = 1;
    // initialEnemies.push(anEnemy)
    enemyGroup.add(anEnemy)
  }
  this.physics.add.collider(enemyGroup, enemyGroup, enemyCollision, null, this).name = 'enemyCollider'
  this.physics.add.collider(character, enemyGroup, characterCollision, null, this).name = 'characterCollider'
  this.physics.add.collider(bloodGroup, bounds, orbWallCollisionCb);
  this.physics.add.collider(bloodGroup, enemyGroup, bloodEnemyCollision);
  // enemy = this.physics.add.sprite(900, 1000, 'enemy_1')
  // enemy2 = this.physics.add.sprite(700, 400, 'enemy_1')
  // // enemy.setVelocityX(100)
  // enemy.setCollideWorldBounds(true); // don't go out of the map
  // enemy.setBounce(1);
  // enemy2.setCollideWorldBounds(true);
  // enemy2.setBounce(1);

  // this.cameras.main.scrollX = 800;
  // Add the enemy
  // 
  this.physics.add.collider(character, bounds)
  this.physics.add.collider(enemyGroup, bounds)

  justShot = false;
  swinging = false;
}

function enemyCollision(anEnemy, anotherEnemy) {
  anEnemy.setVelocityX(75)
  anotherEnemy.setVelocityX(-75)
  console.log("Collision")
  return
}
function characterCollision(character, enemy) {
  if (swinging) {
    enemy.health -= hud.swordLevel;
    if (enemy.health <= 0)
      enemy.destroy();
  } else {
    hud.updateHealth(-1);
  }
}

function bloodEnemyCollision(blood, enemy) {
  enemy.health -= hud.bloodLevel;
  if (enemy.health <= 0)
    enemy.destroy();

  blood.destroy();
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
    centerX: data.width * data.tile_width / 2,
    centerY: 16
  }
  return mapData
}

function buildMap() {
  //  Parse the data out of the map
  var mapData = getMapInfo()
  //console.log(mapData)
  var id, tx, ty;
  for (var y = 0; y < mapData.mapHeight; y++) {
    for (var x = 0; x < mapData.mapWidth; x++) {
      id = mapData.layer[x][y];

      tx = (x - y) * (mapData.tileWidth / 2);
      ty = (x + y) * (mapData.tileHeight / 4);

      var tile = scene.add.image(mapData.centerX + tx, mapData.centerY + ty, "arena", id);

      if (x === 0 || y === 0 || x === 24 || y === 24) {
        var p = new Phaser.Geom.Rectangle(
          mapData.centerX + tx,
          mapData.centerY + ty,
          mapData.tileWidth,
          mapData.tileHeight
        );
        var b = bounds.create(p.x, p.y);

        scene.physics.add.existing(b);
      }
      tile.depth = mapData.centerY + ty;
    }
  }
  scene.physics.world.setBounds(
    0,
    0,
    mapData.mapWidth * mapData.tileWidth,
    mapData.mapHeight * mapData.tileHeight
  );
}

function characterMotion() {
  // Horizontal motion for player
  if (wasd.A.isDown) {
    character.setVelocityX(-200);
  } else if (wasd.D.isDown) {
    character.setVelocityX(200);
  }
  // Horizontal check for stop
  if (wasd.A.isUp && wasd.D.isUp) {
    character.setVelocityX(0);
  }
  // Vertical motion for player
  if (wasd.W.isDown) {
    wasd.A.isDown || wasd.D.isDown
      ? character.setVelocityY(-100)
      : character.setVelocityY(-200);
  } else if (wasd.S.isDown) {
    wasd.A.isDown || wasd.D.isDown
      ? character.setVelocityY(100)
      : character.setVelocityY(200);
  }
  // Vertical check for stop
  if (wasd.W.isUp && wasd.S.isUp) {
    character.setVelocityY(0);
  }
}

function enemyMotion(anEnemy, allEnemies) {
  // If the character is further to the right than the enemy
  if (anEnemy.tick === 100) {
    anEnemy.tick = 0
    if (character.x > anEnemy.x + 10) { // Offset to prevent jitter
      if (anEnemy.body.velocity.x != 75) {
        anEnemy.setVelocityX(75)
      }
    }
    else if (character.x < anEnemy.x - 10) { // Offset to prevent jitter
      if (anEnemy.body.velocity.x != -75) {
        anEnemy.setVelocityX(-75)
      }
    }
    else {
      if (anEnemy.body.velocity.x != 0) {
        anEnemy.setVelocityX(0)
      }
    }
    // If the character is higher up than the enemy
    if (character.y > anEnemy.y + 10) { // Offset to prevent jitter
      anEnemy.setVelocityY(75)
    }
    else if (character.y < anEnemy.y - 10) { // Offset to prevent jitter
      anEnemy.setVelocityY(-75)
    }
    else {
      anEnemy.setVelocityY(0)
    }
    anEnemy.depth = 1000;
  }
  
  
  //allEnemies.forEach(function(anotherEnemy))
  anEnemy.tick += 1
}

function update() {
  characterMotion()
  enemyGroup.children.entries.forEach(function(anEnemy) {
    enemyMotion(anEnemy, initialEnemies);
  });
  //enemyMotion(enemy)
  //enemyMotion(enemy2)
  // this.physics.world.collide(enemy, enemy2, function() {
  // });
  // 
  // enemy2.depth =  enemy2.y + 1000;
  character.depth = character.y + 1000;

  const fOffset = hud.bloodLevel > 0 ? 2 : 0;

  if (combatKeys.O.isDown) {
    character.setFrame(1 + fOffset);
    swinging = true;
  } else {
    character.setFrame(0 + fOffset);
    swinging = false;
  }

  if (hud.bloodLevel > 0 && combatKeys.P.isDown && !justShot) {
    justShot = true;

    var sprite = new BloodOrb(scene, character.x, character.y, "blood_orb", 0);
    sprite.setActive(true);
    bloodGroup.add(sprite);

    var x = 0;
    if (character.body.velocity.x > 0)
      x = 250;
    else if (character.body.velocity.x < 0)
      x = -250;

    var y = 0;
    if (character.body.velocity.y > 0)
      y = 250;
    else if (character.body.velocity.y < 0)
      y = -250;
    
    if (x == 0 && y == 0)
      y = 250;

    sprite.body.setVelocity(x, y);
  } else if (combatKeys.P.isUp) {
    justShot = false;
  }

  if (enemyGroup.countActive() === 0) {
    hud.incrementWave();    
    for (var i = 0; i < hud.currentWave * 2; i++) {
      var anEnemy = this.physics.add.sprite(400 + (Math.random() * 75), 400 + (Math.random() * 75), 'enemy_1')
      anEnemy.setActive(true);
      anEnemy.tick = 0
      anEnemy.health = hud.currentWave * 2;
      // initialEnemies.push(anEnemy)
      enemyGroup.add(anEnemy)
    }
  }
}

function orbWallCollisionCb(orb, wall) {
  orb.destroy();  
}
