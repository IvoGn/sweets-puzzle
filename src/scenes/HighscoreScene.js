'use strict'

import GeneralScene from './GeneralScene.js'

const TITLE_Y = 125
const TITLE_FONT_SIZE = '48px'
const TITLE_COLOR = '#6a4c93'

const PANEL_SCALE = 1.5

const BACK_BTN_OFFSET_Y = 100
const BACK_BTN_SCALE = 1.1
const BACK_BTN_SCALE_HOVER = 1.2
const BACK_BTN_FONT_SIZE = '36px'

const SCORE_FONT_SIZE = '64px'

class HighscoreScene extends GeneralScene {
    constructor(settings) {
        super('HighscoreScene', settings)
    }

    create() {
        super.create()

        this.buildBackground()
        this.buildTitle()
        this.buildHighscorePanel()
        this.buildBackButton()
    }

    buildBackground() {
        this.add.image(this.config.center.x, this.config.center.y, 'background_2')
            .setOrigin(0.5)
            .setDisplaySize(this.config.width, this.config.height)
    }

    buildTitle() {
        this.add.text(this.config.center.x, TITLE_Y, 'Highscore', {
            fontFamily: 'Jreeng',
            fontSize: TITLE_FONT_SIZE,
            color: TITLE_COLOR
        }).setOrigin(0.5)
    }

    buildHighscorePanel() {
        const highscoreBg = this.add.image(this.config.center.x, this.config.center.y, 'button')
            .setOrigin(0.5)
            .setScale(PANEL_SCALE)

        const highscore = this.registry.get('highscore') || 0

        this.add.text(highscoreBg.x, highscoreBg.y, `${highscore}`, {
            fontFamily: 'Jreeng',
            fontSize: SCORE_FONT_SIZE,
            color: '#ffffff'
        }).setOrigin(0.5)
    }

    buildBackButton() {
        const y = this.config.height - BACK_BTN_OFFSET_Y

        const backButton = this.add.image(this.config.center.x, y, 'button')
            .setInteractive({ useHandCursor: true })
            .setScale(BACK_BTN_SCALE)

        this.add.text(backButton.x, backButton.y, 'Back', {
            fontFamily: 'Jreeng',
            fontSize: BACK_BTN_FONT_SIZE,
            color: '#ffffff'
        }).setOrigin(0.5)

        backButton.on('pointerover', () => backButton.setScale(BACK_BTN_SCALE_HOVER))
        backButton.on('pointerout', () => backButton.setScale(BACK_BTN_SCALE))
        backButton.on('pointerdown', () => {
            this.sound.play('button_click')
            this.scene.start('MenuScene')
        })
    }
}

export default HighscoreScene