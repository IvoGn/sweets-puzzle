'use strict'

import Phaser from 'phaser'

class GeneralScene extends Phaser.Scene {
    constructor(key, config) {
        super(key)
        this.config = config
    }

    create() {}

    addUiLabel(x, y, initialText, size = '24px', opts = {}) {
        const { paddingX = 24, height = 50 } = opts

        const container = this.add.container(x, y)

        const label = this.add.text(0, 0, initialText, {
            fontFamily: 'Jreeng',
            fontSize: size,
            color: '#ffffff'
        }).setOrigin(0.5)

        const background = this.add.image(0, 0, 'background_button')
            .setOrigin(0.5)
            .setDisplaySize(Math.ceil(label.width + paddingX * 2), height)

        container.add([background, label])

        Object.assign(container, { background, label, paddingX, height })

        return container
    }

    updateUiLabel(uiContainer, newText) {
        uiContainer.label.setText(newText)
        uiContainer.background.setDisplaySize(
            Math.ceil(uiContainer.label.width + uiContainer.paddingX * 2),
            uiContainer.height
        )
    }
}

export default GeneralScene