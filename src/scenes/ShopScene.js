'use strict'

import GeneralScene from './GeneralScene.js'

const MONEY_PANEL_Y = 70
const MONEY_PANEL_W = 420
const MONEY_PANEL_H = 60
const MONEY_PANEL_FILL = 0xffffff
const MONEY_PANEL_ALPHA = 0.75
const MONEY_PANEL_STROKE = 0x6a4c93

const ITEMS_GAP = 360
const ITEMS_Y_OFFSET = 10

const CARD_SCALE = 1.3
const TITLE_FONT_SIZE = '32px'
const COUNT_FONT_SIZE = '28px'
const BUTTON_FONT_SIZE = '36px'
const BUY_SCALE = 1.0
const BUY_SCALE_HOVER = 1.08
const BACK_SCALE = 1.1
const BACK_SCALE_HOVER = 1.18

class ShopScene extends GeneralScene {
    constructor(settings) {
        super('ShopScene', settings)
    }

    create() {
        super.create()

        this.add.image(this.config.center.x, this.config.center.y, 'background_2')
            .setOrigin(0.5)
            .setDisplaySize(this.config.width, this.config.height)

        if (this.registry.get('money') === undefined) this.registry.set('money', 0)
        if (this.registry.get('bonus_extra') === undefined) this.registry.set('bonus_extra', 0)
        if (this.registry.get('bonus_free') === undefined) this.registry.set('bonus_free', 0)
        if (this.registry.get('bonus_change') === undefined) this.registry.set('bonus_change', 0)

        const moneyPanel = this.add
            .rectangle(this.config.center.x, MONEY_PANEL_Y, MONEY_PANEL_W, MONEY_PANEL_H, MONEY_PANEL_FILL, MONEY_PANEL_ALPHA)
            .setStrokeStyle(2, MONEY_PANEL_STROKE)

        this.moneyText = this.add.text(moneyPanel.x, moneyPanel.y, `Money: ${this.registry.get('money')}`, {
            fontFamily: 'Jreeng',
            fontSize: '32px',
            color: '#4a2c2a'
        }).setOrigin(0.5)

        const items = [
            { key: 'extra',  title: 'Extra Turn',   price: 10, regKey: 'bonus_extra'  },
            { key: 'free',   title: 'Free Move',    price: 15, regKey: 'bonus_free'   },
            { key: 'change', title: 'Change Sweet', price: 20, regKey: 'bonus_change' }
        ]

        const startX = this.config.center.x - ITEMS_GAP
        const y = this.config.center.y + ITEMS_Y_OFFSET

        items.forEach((item, i) => {
            const x = startX + i * ITEMS_GAP
            this.createShopCard(x, y, item)
        })

        this.createButton(this.config.center.x, this.config.height - 90, 'Back', () => {
            this.sound.play('button_click')
            this.scene.start('MenuScene')
        })
    }

    createShopCard(x, y, item) {
        this.add.image(x, y, 'background_button_svg')
            .setOrigin(0.5)
            .setScale(CARD_SCALE)

        this.add.text(x, y - 70, item.title, {
            fontFamily: 'Jreeng',
            fontSize: TITLE_FONT_SIZE,
            color: '#ffffff'
        }).setOrigin(0.5)

        const countText = this.add.text(
            x, y - 20, `currently: ${this.registry.get(item.regKey)}`,
            { fontFamily: 'Jreeng', fontSize: COUNT_FONT_SIZE, color: '#ffffff' }
        ).setOrigin(0.5)

        const buyBtn = this.add.image(x, y + 55, 'button')
            .setOrigin(0.5)
            .setScale(BUY_SCALE)
            .setInteractive({ useHandCursor: true })

        this.add.text(buyBtn.x, buyBtn.y, `buy for ${item.price}`, {
            fontFamily: 'Jreeng',
            fontSize: BUTTON_FONT_SIZE,
            color: '#ffffff'
        }).setOrigin(0.5)

        buyBtn.on('pointerover', () => buyBtn.setScale(BUY_SCALE_HOVER))
        buyBtn.on('pointerout',  () => buyBtn.setScale(BUY_SCALE))

        const onBuy = () => {
            const ok = this.tryPurchase(item.price, item.regKey)
            if (ok) {
                this.sound.play('button_click')
                countText.setText(`currently: ${this.registry.get(item.regKey)}`)
                this.moneyText.setText(`Money: ${this.registry.get('money')}`)
            } else {
                this.sound.play('selection')
            }
        }

        buyBtn.on('pointerdown', onBuy)
    }

    tryPurchase(price, bonusKey) {
        const money = this.registry.get('money')
        if (money < price) return false
        this.registry.set('money', money - price)
        this.registry.set(bonusKey, (this.registry.get(bonusKey) || 0) + 1)
        return true
    }

    createButton(x, y, text, callback) {
        const btn = this.add.image(x, y, 'button')
            .setInteractive({ useHandCursor: true })
            .setScale(BACK_SCALE)

        this.add.text(x, y, text, {
            fontFamily: 'Jreeng',
            fontSize: BUTTON_FONT_SIZE,
            color: '#ffffff'
        }).setOrigin(0.5)

        btn.on('pointerover', () => btn.setScale(BACK_SCALE_HOVER))
        btn.on('pointerout',  () => btn.setScale(BACK_SCALE))
        btn.on('pointerdown', callback)
    }
}

export default ShopScene