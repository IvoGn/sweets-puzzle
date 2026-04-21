'use strict'

import GeneralScene from './GeneralScene.js'

const MENU_RIGHT_MARGIN = 250
const BUTTON_SPACING = 160
const START_Y_OFFSET = -220
const BUTTON_SCALE = 1.2
const BUTTON_SCALE_HOVER = 1.3
const BUTTON_FONT_SIZE = '36px'

class MenuScene extends GeneralScene {
    constructor(settings) {
        super('MenuScene', settings)
    }

    create() {
        super.create()
        this.buildMenuBackground()
        this.buildMenuButtons()
        this.setupMusic()
    }

    buildMenuBackground() {
        this.add.image(this.config.center.x, this.config.center.y, 'background_1')
            .setOrigin(0.5)
            .setDisplaySize(this.config.width, this.config.height)
    }

    buildMenuButtons() {
        const buttonData = [
            { text: 'Start Game', scene: 'GameScene' },
            { text: 'Highscore', scene: 'HighscoreScene' },
            { text: 'Shop', scene: 'ShopScene' },
            { text: 'Exit', scene: null }
        ]

        const startY = this.config.center.y + START_Y_OFFSET

        buttonData.forEach((btn, index) => {
            const y = startY + index * BUTTON_SPACING
            const x = this.config.width - MENU_RIGHT_MARGIN

            const button = this.add.image(x, y, 'button')
                .setInteractive({ useHandCursor: true })
                .setScale(BUTTON_SCALE)

            this.add.text(button.x, button.y, btn.text, {
                fontFamily: 'Jreeng',
                fontSize: BUTTON_FONT_SIZE,
                color: '#ffffff'
            }).setOrigin(0.5)

            button.on('pointerover', () => button.setScale(BUTTON_SCALE_HOVER))
            button.on('pointerout', () => button.setScale(BUTTON_SCALE))

            button.on('pointerdown', () => {
                this.sound.play('button_click')
                if (btn.scene) {
                    this.scene.start(btn.scene)
                } else {
                    this.game.destroy(true)
                }
            })
        })
    }

    setupMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.resume()
            return
        }
        this.backgroundMusic = this.sound.add('background_music', { volume: 0.3, loop: true })
        this.backgroundMusic.play()
    }
}

export default MenuScene