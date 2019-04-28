import Phaser from "phaser";
import healthBg from "./assets/health_bar_bg.png";
import healthBar from "./assets/health_bar.png";

export default class Hud extends Phaser.Scene
{
    constructor()
    {
        super({ key: 'HUDScene', active: true });

        this.healthDisplayWidth = 200;
        this.maxHealth = 100;
        this.currentHealth = 100;

        this.currentWave = 1;
    }

    preload()
    {
        this.load.image("healthBg", healthBg);
        this.load.image("healthBar", healthBar);
    }

    create()
    {
        this.cameras.main.setZoom(2);

        this.add.image(260, 165, 'healthBg');
        this.healthBar = this.add.image(210, 165, 'healthBar');
        this.healthBar.displayOriginX = 0;

        this.waveCounter = this.add.text(215, 180, "Wave: " + this.currentWave, { fontFamily: '"Roboto Condensed"' });
    }

    updateHealth(val)
    {
        this.currentHealth += val;
        this.healthBar.displayWidth += (val * (this.healthDisplayWidth / this.maxHealth));

        if (0 > this.currentHealth)
            this.currentHealth = 0;
        else if (this.maxHealth < this.currentHealth)
            this.currentHealth = this.maxHealth;

        if (0 > this.healthBar.displayWidth)
            this.healthBar.displayWidth = 0;
        else if (this.healthDisplayWidth < this.healthBar.displayWidth)
            this.healthBar.displayWidth = this.healthDisplayWidth;
    }

    incrementWave()
    {
        ++this.currentWave;
        this.waveCounter.text = "Wave: " + this.currentWave;
    }

    resetWave()
    {
        this.currentWave = 1;
        this.waveCounter.text = "Wave: " + this.currentWave;
    }
}