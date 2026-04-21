'use strict'

import GeneralScene from './GeneralScene.js'

const LOADER_BAR_WIDTH = 300
const LOADER_BAR_HEIGHT = 20
const LOADER_BAR_COLOR = 0xffa500
const LOADER_BAR_STROKE = 0x6a4c93
const LOADER_TEXT_OFFSET_Y = -60

class PreloadScene extends GeneralScene {
    constructor(settings) {
        super('PreloadScene', settings)
    }

    init() {
        this.cameras.main.setBackgroundColor('#bde0fe')
        this.progressBar = this.add.graphics()

        this.loadingText = this.add.text(
            this.config.center.x,
            this.config.center.y + LOADER_TEXT_OFFSET_Y,
            'Loading...',
            { fontFamily: 'Jreeng', fontSize: '32px', color: '#6a4c93' }
        ).setOrigin(0.5)

        this.wireLoadingEvents()
    }

    wireLoadingEvents() {
        this.load.on('progress', value => {
            this.progressBar.clear()
            this.progressBar.fillStyle(LOADER_BAR_COLOR)
            this.progressBar.fillRect(
                this.config.center.x - LOADER_BAR_WIDTH / 2,
                this.config.center.y,
                LOADER_BAR_WIDTH * value,
                LOADER_BAR_HEIGHT
            )
            this.progressBar.lineStyle(2, LOADER_BAR_STROKE)
            this.progressBar.strokeRect(
                this.config.center.x - LOADER_BAR_WIDTH / 2,
                this.config.center.y,
                LOADER_BAR_WIDTH,
                LOADER_BAR_HEIGHT
            )
        })

        this.load.on('complete', () => {
            this.progressBar.destroy()
            this.loadingText.setText('Ready!')
            this.buildStartButton()
        })
    }

    buildStartButton() {
        const startButton = this.add.image(
            this.config.center.x,
            this.config.center.y + 60,
            'button'
        )
            .setInteractive({ useHandCursor: true })
            .setScale(0.7)

        this.add.text(startButton.x, startButton.y, 'Start Game', {
            fontFamily: 'Jreeng',
            fontSize: '28px',
            color: '#ffffff'
        }).setOrigin(0.5)

        startButton.on('pointerover', () => startButton.setScale(0.75))
        startButton.on('pointerout', () => startButton.setScale(0.7))
        startButton.on('pointerdown', () => {
            this.sound.play('button_click')
            this.scene.start('MenuScene')
        })
    }

    preload() {
        // Schrift
        this.load.font('Jreeng', 'assets/fonts/Jreeng.ttf', 'truetype')

        // Hintergründe & UI
        this.load.image('background_1', 'assets/images/background_1.png')
        this.load.image('background_2', 'assets/images/background_2.png')
        this.load.image('background_button', 'assets/images/background_button.png')
        this.load.image('background_cookies_active', 'assets/images/background_cookies_active.png')
        this.load.image('background_cookies', 'assets/images/background_cookies.png')
        this.load.image('banner_game_over', 'assets/images/banner_game_over.png')

        // SVG-Bilder
        this.load.svg('background_button_svg', 'assets/images/background_button.svg')
        this.load.svg('bread_1', 'assets/images/bread_1.svg')
        this.load.svg('bread_2', 'assets/images/bread_2.svg')
        this.load.svg('button', 'assets/images/button.svg')
        this.load.svg('cake_1', 'assets/images/cake_1.svg')
        this.load.svg('cake_2', 'assets/images/cake_2.svg')
        this.load.svg('criossant', 'assets/images/criossant.svg')
        this.load.svg('doughnut', 'assets/images/doughnut.svg')
        this.load.svg('game_over2', 'assets/images/game_over2.svg')
        this.load.svg('game_over', 'assets/images/game_over.svg')
        this.load.svg('keks_1', 'assets/images/keks_1.svg')
        this.load.svg('keks_2', 'assets/images/keks_2.svg')
        this.load.svg('macaron', 'assets/images/macaron.svg')
        this.load.svg('muffin_1', 'assets/images/muffin_1.svg')
        this.load.svg('muffin_2', 'assets/images/muffin_2.svg')
        this.load.svg('streuselschnecke', 'assets/images/streuselschnecke.svg')

        // Sounds
        this.load.audio('background_music', 'assets/sounds/background_music.wav')
        this.load.audio('button_click', 'assets/sounds/button_click.wav')
        this.load.audio('combine_and_renew', 'assets/sounds/combine_and_renew.wav')
        this.load.audio('selection', 'assets/sounds/selection.wav')
        this.load.audio('swap', 'assets/sounds/swap.wav')
    }

    create() {}
}

export default PreloadScene