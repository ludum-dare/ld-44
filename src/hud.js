import Phaser from "phaser";
import healthBg from "./assets/health_bar_bg.png";
import healthBar from "./assets/health_bar.png";
import iconSheet from "./assets/icon_sheet.png"

export default class Hud extends Phaser.Scene
{
    constructor()
    {
        super({ key: 'HUDScene', active: true });

        this.healthDisplayWidth = 200;
        this.maxHealth = 100;
        this.currentHealth = 100;

        this.currentWave = 1;

        this.swordLevel = 1;
        this.bloodLevel = 0;
    }

    preload()
    {
        this.load.image("healthBg", healthBg);
        this.load.image("healthBar", healthBar);
        this.load.spritesheet("icons", iconSheet, {
            frameWidth: 32,
            frameHeight: 32
          });
    }

    create()
    {
        this.cameras.main.setZoom(2);

        this.add.image(260, 165, 'healthBg');
        this.healthBar = this.add.image(210, 165, 'healthBar');
        this.healthBar.displayOriginX = 0;

        this.waveCounter = this.add.text(215, 180, "Wave: " + this.currentWave, { fontFamily: '"Roboto Condensed"' });

        this.add.image(530, 175, "icons", 0);
        this.add.image(570, 175, "icons", 1);

        this.swordHover = this.add.image(530, 175, "icons", 2)
        .setInteractive()
        .on('pointerover', () => this.swordHover.setAlpha(1))
        .on('pointerout', () => this.swordHover.setAlpha(0.001))
        .on('pointerdown', () => this.upgradeSword());
        this.swordHover.setAlpha(0.001);

        this.bloodHover = this.add.image(570, 175, "icons", 3)
        .setInteractive()
        .on('pointerover', () => this.bloodHover.setAlpha(1))
        .on('pointerout', () => this.bloodHover.setAlpha(0.001))
        .on('pointerdown', () => this.upgradeBlood());
        this.bloodHover.setAlpha(0.001);

        this.bloodDisabled = this.add.image(570, 175, "icons", 5);

        this.swordUpgrade = this.add.image(530, 175, "icons", 4);
        this.swordUpgrade.setVisible(false);
        this.bloodUpgrade = this.add.image(570, 175, "icons", 4);
        this.bloodUpgrade.setVisible(false);
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

    decrementMaxHealth()
    {
        this.maxHealth -= this.maxHealth / 10;
        if (0 > this.maxHealth)
            this.maxHealth = 1;

        if (this.maxHealth < this.currentHealth) {
            this.currentHealth = this.maxHealth;
            this.healthBar.displayWidth = this.healthDisplayWidth / 2;
        }
    }

    incrementWave()
    {
        ++this.currentWave;
        this.waveCounter.text = "Wave: " + this.currentWave;

        this.enableSwordUpgrade();
        this.enableBloodUpgrade();
    }

    resetWave()
    {
        this.healthDisplayWidth = 200;
        this.maxHealth = 100;
        this.currentHealth = 100;

        this.currentWave = 1;

        this.swordLevel = 1;
        this.bloodLevel = 0;

        this.swordUpgrade.setVisible(false);
        this.bloodUpgrade.setVisible(false);

        this.waveCounter.text = "Wave: " + this.currentWave;
        this.bloodDisabled.setVisible(true);
    }

    enableSwordUpgrade()
    {
        this.swordUpgrade.setVisible(true);
    }

    enableBloodUpgrade()
    {
        this.bloodUpgrade.setVisible(true);
    }

    upgradeSword()
    {
        if (this.swordUpgrade.visible) {
            ++this.swordLevel;
            this.swordUpgrade.setVisible(false);
            this.bloodUpgrade.setVisible(false);

            this.decrementMaxHealth();
        }
    }

    upgradeBlood()
    {
        if (this.bloodUpgrade.visible) {
            ++this.bloodLevel;
            this.swordUpgrade.setVisible(false);
            this.bloodUpgrade.setVisible(false);

            this.bloodDisabled.setVisible(false);

            this.decrementMaxHealth();
        }
    }
}