import Phaser from "phaser";

export default class BloodOrb extends Phaser.GameObjects.Sprite
{
    constructor (scene, x, y, texture, key) {
        super(scene, x, y, texture, key);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
    }

    preUpdate(time, delta)
    {
        this.depth = this.y + 1000;
    }
}