'use strict'

import GeneralScene from './GeneralScene.js'

const GRID_ROWS = 9
const GRID_COLS = 8
const CELL_SIZE = 70
const GRID_OFFSET_X = 450
const GRID_OFFSET_Y = 120
const SWEET_INSET = 4

const UI_SCORE_X = 225
const UI_SCORE_Y = 40
const UI_HIGHSCORE_X = 500
const UI_HIGHSCORE_Y = 40
const UI_TURNS_X = 775
const UI_TURNS_Y = 40
const UI_MONEY_X = 1050
const UI_MONEY_Y = 40

const BONUS_LEFT_X = 225
const BONUS_HEADER_Y = 120
const BONUS_EXTRA_Y = 220
const BONUS_FREE_Y = 400
const BONUS_CHANGE_Y = 580

const PICKER_MARGIN = 120
const PICKER_COLS = 3
const PICKER_PAD = 10

const SWAP_TWEEN_MS = 180
const DROP_TWEEN_MS = 160
const REFILL_DELAY_MS = 180

const SCORE_PER_SWEET = 10
const MONEY_PER_SWEET = 5

const START_TURNS = 20

class GameScene extends GeneralScene {
    constructor(settings) {
        super('GameScene', settings)
    }

    create() {
        super.create()

        this.buildBackground()
        this.setupRegistryDefaults()
        this.setupState()
        this.buildTopUi()
        this.buildBonusBar()
        this.setupGrid()
        this.wireInput()
    }

    buildBackground() {
        this.add.image(this.config.center.x, this.config.center.y, 'background_2')
            .setOrigin(0.5)
            .setDisplaySize(this.config.width, this.config.height)
    }

    setupRegistryDefaults() {
        if (this.registry.get('money') === undefined) this.registry.set('money', 0)
        if (this.registry.get('bonus_extra') === undefined) this.registry.set('bonus_extra', 0)
        if (this.registry.get('bonus_free') === undefined) this.registry.set('bonus_free', 0)
        if (this.registry.get('bonus_change') === undefined) this.registry.set('bonus_change', 0)
        if (this.registry.get('highscore') === undefined) this.registry.set('highscore', 0)
    }

    setupState() {
        this.score = 0
        this.turns = START_TURNS
        this.money = this.registry.get('money') || 0
        this.highscore = this.registry.get('highscore') || 0
        this.freeMoveArmed = false
        this.changeSweetArmed = false

        this.isPickingSweet = false
        this.changeTargetSweet = null
        this.pickerContainer = null

        this.rows = GRID_ROWS
        this.cols = GRID_COLS
        this.cellSize = CELL_SIZE
        this.offsetX = GRID_OFFSET_X
        this.offsetY = GRID_OFFSET_Y

        this.sweets = [
            'bread_1', 'bread_2',
            'cake_1', 'cake_2',
            'criossant',
            'doughnut',
            'keks_1', 'keks_2',
            'macaron',
            'muffin_1', 'muffin_2',
            'streuselschnecke'
        ]

        this.grid = []
        this.bgGrid = []
        this.bonusTexts = {}
    }

    buildTopUi() {
        this.scoreUi = this.addUiLabel(UI_SCORE_X, UI_SCORE_Y, `Score: ${this.score}`)
        this.highscoreUi = this.addUiLabel(UI_HIGHSCORE_X, UI_HIGHSCORE_Y, `Highscore: ${this.highscore}`)
        this.turnsUi = this.addUiLabel(UI_TURNS_X, UI_TURNS_Y, `Turns: ${this.turns}`)
        this.moneyUi = this.addUiLabel(UI_MONEY_X, UI_MONEY_Y, `Money: ${this.money}`)
    }

    buildBonusBar() {
        this.addUiLabel(BONUS_LEFT_X, BONUS_HEADER_Y, 'Bonuses', '28px', { padX: 20, padY: 8, height: 48 })

        this.createBonusButton(BONUS_LEFT_X, BONUS_EXTRA_Y, 'Extra Turn', 'bonus_extra', () => {
            const cnt = this.registry.get('bonus_extra') || 0
            if (cnt <= 0) return this.sound.play('selection')
            this.registry.set('bonus_extra', cnt - 1)
            this.turns++
            this.updateUiLabel(this.turnsUi, `Turns: ${this.turns}`)
            this.updateBonusTexts()
            this.sound.play('button_click')
        })

        this.createBonusButton(BONUS_LEFT_X, BONUS_FREE_Y, 'Free Move', 'bonus_free', () => {
            const cnt = this.registry.get('bonus_free') || 0
            if (cnt <= 0) return this.sound.play('selection')
            this.registry.set('bonus_free', cnt - 1)
            this.freeMoveArmed = true
            this.updateBonusTexts()
            this.sound.play('button_click')
        })

        this.createBonusButton(BONUS_LEFT_X, BONUS_CHANGE_Y, 'Change Sweet', 'bonus_change', () => {
            const cnt = this.registry.get('bonus_change') || 0
            if (cnt <= 0) return this.sound.play('selection')
            this.registry.set('bonus_change', cnt - 1)
            this.changeSweetArmed = true
            this.updateBonusTexts()
            this.sound.play('button_click')
        })
    }

    setupGrid() {
        this.createBackgroundGrid()
        this.drawGrid()
    }

    wireInput() {
        this.input.setTopOnly(true)

        this.input.on('gameobjectdown', this.onSweetDown, this)

        this.input.on('pointerdown', (pointer, objects) => {
            const hitSweet = objects && objects.some(o => o.isSweet)
            const hitPicker = objects && objects.some(o => o.isPickerItem)

            if (this.isPickingSweet) {
                if (this.pickerJustOpened) return
                if (!hitPicker) return
                return
            }

            if (!hitSweet) this.clearSelection()
        })

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.launch('PauseScene', { gameOver: false })
            this.scene.pause()
        })
    }

    uiStyle(size = '24px') {
        return {
            fontFamily: 'Jreeng',
            fontSize: size,
            color: '#ffffff'
        }
    }

    createBonusButton(x, y, label, regKey, onClick) {
        const btn = this.add.image(x, y, 'button')
            .setInteractive({ useHandCursor: true })
            .setScale(0.9)

        this.add.text(x, y, label, {
            fontFamily: 'Jreeng',
            fontSize: '28px',
            color: '#ffffff'
        }).setOrigin(0.5)

        btn.on('pointerover', () => btn.setScale(1.0))
        btn.on('pointerout', () => btn.setScale(0.9))
        btn.on('pointerdown', onClick)

        const t = this.add.text(x, y + 28, `x ${this.registry.get(regKey) || 0}`, this.uiStyle('24px')).setOrigin(0.5)
        this.bonusTexts[regKey] = t
    }

    updateBonusTexts() {
        for (const key of ['bonus_extra', 'bonus_free', 'bonus_change']) {
            if (this.bonusTexts[key]) {
                this.bonusTexts[key].setText(`x ${this.registry.get(key) || 0}`)
            }
        }
    }

    createBackgroundGrid() {
        for (let r = 0; r < this.rows; r++) {
            this.bgGrid[r] = []
            for (let c = 0; c < this.cols; c++) {
                const bg = this.add.image(
                    this.offsetX + c * this.cellSize,
                    this.offsetY + r * this.cellSize,
                    'background_cookies'
                )
                    .setOrigin(0.5)
                    .setDisplaySize(this.cellSize, this.cellSize)
                    .setDepth(0)
                this.bgGrid[r][c] = bg
            }
        }
    }

    setCellActive(row, col, active) {
        const tex = active ? 'background_cookies_active' : 'background_cookies'
        const bg = this.bgGrid?.[row]?.[col]
        if (bg && bg.texture.key !== tex) bg.setTexture(tex)
    }

    clearSelection() {
        if (!this.selectedSweet) return
        this.setCellActive(this.selectedSweet.row, this.selectedSweet.col, false)
        this.selectedSweet = null
        this.sound.play('selection')
    }

    drawGrid() {
        for (let r = 0; r < this.rows; r++) {
            this.grid[r] = []
            for (let c = 0; c < this.cols; c++) {
                const textureKey = Phaser.Utils.Array.GetRandom(this.sweets)
                const sprite = this.add.image(
                    this.offsetX + c * this.cellSize,
                    this.offsetY + r * this.cellSize,
                    textureKey
                )
                    .setInteractive()
                    .setDisplaySize(this.cellSize - SWEET_INSET, this.cellSize - SWEET_INSET)
                    .setDepth(1)
                sprite.row = r
                sprite.col = c
                sprite.type = textureKey
                sprite.isSweet = true
                this.grid[r][c] = sprite
            }
        }
    }

    onSweetDown(pointer, obj) {
        if (!obj || !obj.isSweet) return
        if (this.isPickingSweet) return

        if (this.changeSweetArmed) {
            this.changeSweetArmed = false
            this.selectedSweet = obj
            this.setCellActive(obj.row, obj.col, true)
            this.showSweetPicker(obj)
            return
        }

        if (!this.selectedSweet) {
            this.selectedSweet = obj
            this.setCellActive(obj.row, obj.col, true)
            this.sound.play('selection')
        } else {
            this.setCellActive(this.selectedSweet.row, this.selectedSweet.col, false)
            if (obj !== this.selectedSweet) this.trySwap(this.selectedSweet, obj)
            this.selectedSweet = null
        }
    }

    showSweetPicker(targetSweet) {
        this.isPickingSweet = true
        this.changeTargetSweet = targetSweet

        this.pickerJustOpened = true
        this.input.once('pointerup', () => { this.pickerJustOpened = false })

        const cols = PICKER_COLS
        const tile = this.cellSize
        const pad = PICKER_PAD
        const rows = Math.ceil(this.sweets.length / cols)
        const width = cols * tile + pad * 2
        const height = rows * tile + pad * 2

        let pickerX = this.offsetX + this.cols * this.cellSize + PICKER_MARGIN
        const pickerY = this.offsetY + (this.rows * this.cellSize) / 2
        const minX = width / 2 + 20
        const maxX = this.config.width - width / 2 - 20
        pickerX = Phaser.Math.Clamp(pickerX, minX, maxX)

        const container = this.add.container(0, 0).setDepth(10)

        const panel = this.add.rectangle(pickerX, pickerY, width, height, 0x000000, 0.25)
            .setStrokeStyle(2, 0x000000, 0.35)
            .setInteractive()
        panel.isPickerItem = true
        container.add(panel)

        this.sweets.forEach((key, index) => {
            const r = Math.floor(index / cols)
            const c = index % cols

            const cellX = pickerX - width / 2 + pad + tile / 2 + c * tile
            const cellY = pickerY - height / 2 + pad + tile / 2 + r * tile

            const cell = this.add.container(cellX, cellY)
            cell.setSize(tile, tile)
            cell.setInteractive({ useHandCursor: true })
            cell.isPickerItem = true
            cell._targetKey = key

            const bg = this.add.image(0, 0, 'background_cookies')
                .setDisplaySize(tile, tile)
            cell.add(bg)

            const icon = this.add.image(0, 0, key)
                .setDisplaySize(tile - SWEET_INSET, tile - SWEET_INSET)
            cell.add(icon)

            cell.on('pointerover', () => bg.setTexture('background_cookies_active'))
            cell.on('pointerout', () => bg.setTexture('background_cookies'))
            cell.on('pointerdown', () => this.applyChangeSweet(targetSweet, cell._targetKey))

            container.add(cell)
        })

        this.pickerContainer = container
    }

    hideSweetPicker() {
        if (this.pickerContainer) this.pickerContainer.destroy()
        this.pickerContainer = null
        this.isPickingSweet = false
        this.changeTargetSweet = null
        this.pickerJustOpened = false
    }

    applyChangeSweet(targetSweet, newType) {
        if (!targetSweet || !targetSweet.active) {
            this.hideSweetPicker()
            this.clearSelection()
            return
        }

        targetSweet.type = newType
        targetSweet.setTexture(newType)

        this.hideSweetPicker()
        this.clearSelection()

        const matches = this.findMatches()
        if (matches.size > 0) this.handleMatches(matches)
    }

    trySwap(a, b) {
        const dx = Math.abs(a.col - b.col)
        const dy = Math.abs(a.row - b.row)
        const adjacent = dx + dy === 1

        if (!adjacent && !this.freeMoveArmed) {
            this.sound.play('selection')
            return
        }

        if (!adjacent && this.freeMoveArmed) {
            this.freeMoveArmed = false
        }

        const ax = a.x
        const ay = a.y
        const bx = b.x
        const by = b.y
        this.swapGridIndices(a, b)

        this.tweens.add({ targets: a, x: bx, y: by, duration: SWAP_TWEEN_MS })
        this.tweens.add({
            targets: b,
            x: ax,
            y: ay,
            duration: SWAP_TWEEN_MS,
            onComplete: () => {
                this.sound.play('swap')
                this.turns--
                this.updateUiLabel(this.turnsUi, `Turns: ${this.turns}`)
                const matches = this.findMatches()
                if (matches.size > 0) this.handleMatches(matches)
                if (this.turns <= 0) this.triggerGameOver()
            }
        })
    }

    swapGridIndices(a, b) {
        const rA = a.row
        const cA = a.col
        const rB = b.row
        const cB = b.col
        a.row = rB
        a.col = cB
        b.row = rA
        b.col = cA
        this.grid[rA][cA] = b
        this.grid[rB][cB] = a
    }

    findMatches() {
        const set = new Set()

        for (let r = 0; r < this.rows; r++) {
            let streak = 1
            for (let c = 1; c < this.cols; c++) {
                const curr = this.grid[r][c]
                const prev = this.grid[r][c - 1]
                if (curr && prev && curr.type === prev.type) {
                    streak++
                } else {
                    if (streak >= 3) {
                        for (let k = 0; k < streak; k++) set.add(this.grid[r][c - 1 - k])
                    }
                    streak = 1
                }
            }
            if (streak >= 3) {
                for (let k = 0; k < streak; k++) set.add(this.grid[r][this.cols - 1 - k])
            }
        }

        for (let c = 0; c < this.cols; c++) {
            let streak = 1
            for (let r = 1; r < this.rows; r++) {
                const curr = this.grid[r][c]
                const prev = this.grid[r - 1][c]
                if (curr && prev && curr.type === prev.type) {
                    streak++
                } else {
                    if (streak >= 3) {
                        for (let k = 0; k < streak; k++) set.add(this.grid[r - 1 - k][c])
                    }
                    streak = 1
                }
            }
            if (streak >= 3) {
                for (let k = 0; k < streak; k++) set.add(this.grid[this.rows - 1 - k][c])
            }
        }

        return set
    }

    handleMatches(set) {
        this.sound.play('combine_and_renew')

        const FADE_MS = 150

        let gainedScore = 0
        let gainedMoney = 0

        set.forEach(sprite => {
            if (!sprite || !sprite.active) return
            gainedScore += SCORE_PER_SWEET
            gainedMoney += MONEY_PER_SWEET

            const row = sprite.row
            const col = sprite.col

            this.grid[row][col] = null

            this.tweens.add({
                targets: sprite,
                duration: FADE_MS,
                scale: 0.3,
                alpha: 0,
                ease: 'Quad.easeIn',
                onComplete: () => sprite.destroy()
            })
        })

        this.score += gainedScore
        this.money += gainedMoney
        this.updateUiLabel(this.scoreUi, `Score: ${this.score}`)
        this.updateUiLabel(this.moneyUi, `Money: ${this.money}`)

        if (this.score > this.highscore) {
            this.highscore = this.score
            this.updateUiLabel(this.highscoreUi, `Highscore: ${this.highscore}`)
            this.registry.set('highscore', this.highscore)
        }

        this.registry.set('money', this.money)

        this.time.delayedCall(FADE_MS + 40, () => this.dropAndRefill(() => {
            const newMatches = this.findMatches()
            if (newMatches.size > 0) this.handleMatches(newMatches)
        }))
    }

    dropAndRefill(onDone) {
        for (let c = 0; c < this.cols; c++) {
            for (let r = this.rows - 1; r >= 0; r--) {
                if (this.grid[r][c] === null) {
                    for (let rr = r - 1; rr >= 0; rr--) {
                        if (this.grid[rr][c]) {
                            const sprite = this.grid[rr][c]
                            this.grid[r][c] = sprite
                            this.grid[rr][c] = null
                            sprite.row = r
                            this.tweens.add({
                                targets: sprite,
                                y: this.offsetY + r * this.cellSize,
                                duration: DROP_TWEEN_MS
                            })
                            break
                        }
                    }
                }
            }
        }

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c] === null) {
                    const textureKey = Phaser.Utils.Array.GetRandom(this.sweets)
                    const sprite = this.add.image(
                        this.offsetX + c * this.cellSize,
                        this.offsetY + r * this.cellSize,
                        textureKey
                    )
                        .setInteractive()
                        .setDisplaySize(this.cellSize - SWEET_INSET, this.cellSize - SWEET_INSET)
                        .setDepth(1)
                    sprite.row = r
                    sprite.col = c
                    sprite.type = textureKey
                    sprite.isSweet = true
                    this.grid[r][c] = sprite
                }
            }
        }

        if (onDone) this.time.delayedCall(REFILL_DELAY_MS, onDone)
    }

    triggerGameOver() {
        this.input.removeAllListeners()
        this.time.delayedCall(150, () => {
            this.scene.launch('PauseScene', { gameOver: true })
            this.scene.pause()
        })
    }
}

export default GameScene