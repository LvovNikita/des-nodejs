const E = require('./roundFn/expansion')
const xorWhitener = require('./roundFn/xorWhitener')
const splitRTo6BitChunks = require('./roundFn/splitRTo6BitChunks')
const sBox = require('./roundFn/sBox')
const pBox = require('./roundFn/pBox')
const getNewR = require('./roundFn/getNewR')
const finalSwap = require('./roundFn/finalSwap')

const roundFunction = function () {
    const NUM_OF_ROUNDS = 16
    for (const block of this.blocks) {
        for (let round = 0; round < NUM_OF_ROUNDS; round++) {
            const originalR = [...block.R]
            // FIXME: refactor
            block.R = E(block)
            block.R = xorWhitener.call(this, block.R, round)
            block.R = splitRTo6BitChunks(block.R)
            block.R = sBox(block.R)
            block.R = pBox(block.R)
            // block parts for the next round:
            block.R = getNewR(block)
            block.L = [...originalR]
        }
    }
    // final swap!
    finalSwap.call(this)

    this.status.push('ROUND FUNCTION')
    return this
}

module.exports = roundFunction