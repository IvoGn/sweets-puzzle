'use strict'

import GameScene from './scenes/GameScene.js'
import MenuScene from './scenes/MenuScene.js'
import HighscoreScene from './scenes/HighscoreScene.js'
import ShopScene from './scenes/ShopScene.js'
import PauseScene from './scenes/PauseScene.js'
import PreloadScene from './scenes/PreloadScene.js'

const WIDTH = 1280
const HEIGHT = 720

const settings = {
    width: WIDTH,
    height: HEIGHT,
    center: {
        x: WIDTH / 2,
        y: HEIGHT / 2
    },
    textSpace: 50,
    grid: { rows: 9, cols: 8, cellSize: 70 }
}

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: settings.width,
        height: settings.height
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [
        new PreloadScene(settings),
        new MenuScene(settings),
        new HighscoreScene(settings),
        new ShopScene(settings),
        new GameScene(settings),
        new PauseScene(settings)
    ]
}

new Phaser.Game(config)