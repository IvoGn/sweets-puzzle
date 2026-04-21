'use strict'

import GeneralScene from './GeneralScene.js'

const OVERLAY_COLOR = 'rgba(255, 182, 193, 0.7)'

const TITLE_OFFSET_Y = -150
const TITLE_FONT_SIZE = '48px'
const TITLE_COLOR = '#6a4c93'

const BUTTON_FONT_SIZE = '36px'
const BUTTON_SCALE = 1.1
const BUTTON_SCALE_HOVER = 1.2
const MENU_BUTTON_OFFSET_Y = 250

const GAMEOVER_BANNER_OFFSET_Y = -100
const GAMEOVER_BUTTON_OFFSET_Y = 100
const GAMEOVER_BANNER_SCALE = 0.7

class PauseScene extends GeneralScene {
    constructor(settings) {
        super('PauseScene', settings)
    }

    create({ gameOver }) {
        this.cameras.main.setBackgroundColor(OVERLAY_COLOR)
        if (gameOver) {
            this.addGameOver()
        } else {
            this.addPauseMenu()
        }
    }

    addPauseMenu() {
        this.add.text(
            this.config.center.x,
            this.config.center.y + TITLE_OFFSET_Y,
            'Paused',
            {
                fontFamily: 'Jreeng',
                fontSize: TITLE_FONT_SIZE,
                color: TITLE_COLOR
            }
        ).setOrigin(0.5)

        this.createButton(
            this.config.center.x,
            this.config.center.y,
            'Resume',
            () => this.backToGame()
        )

        this.createButton(
            this.config.center.x,
            this.config.center.y + MENU_BUTTON_OFFSET_Y,
            'Menu',
            () => this.backToMenu()
        )
    }

    addGameOver() {
        this.add.image(
            this.config.center.x,
            this.config.center.y + GAMEOVER_BANNER_OFFSET_Y,
            'banner_game_over'
        )
            .setOrigin(0.5)
            .setScale(GAMEOVER_BANNER_SCALE)

        this.createButton(
            this.config.center.x,
            this.config.center.y + GAMEOVER_BUTTON_OFFSET_Y,
            'Back to Menu',
            () => this.backToMenu()
        )
    }

    createButton(x, y, text, callback) {
        const button = this.add.image(x, y, 'button')
            .setInteractive({ useHandCursor: true })
            .setScale(BUTTON_SCALE)

        this.add.text(x, y, text, {
            fontFamily: 'Jreeng',
            fontSize: BUTTON_FONT_SIZE,
            color: '#ffffff'
        }).setOrigin(0.5)

        button.on('pointerover', () => button.setScale(BUTTON_SCALE_HOVER))
        button.on('pointerout', () => button.setScale(BUTTON_SCALE))
        button.on('pointerdown', () => {
            this.sound.play('button_click')
            callback()
        })
    }

    backToMenu() {
        this.scene.stop('GameScene')
        this.scene.start('MenuScene')
    }

    backToGame() {
        this.scene.stop()
        this.scene.resume('GameScene')
    }
}

export default PauseScene