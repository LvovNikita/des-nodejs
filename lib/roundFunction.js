const E = require('./roundFn/expansion')
const xorWhitener = require('./roundFn/xorWhitener')
const splitRTo6BitChunks = require('./roundFn/splitRTo6BitChunks')
const sBox = require('./roundFn/sBox')
const pBox = require('./roundFn/pBox')
const getNewR = require('./roundFn/getNewR')
const finalSwap = require('./roundFn/finalSwap')

const roundFunction = function () {
    console.time('roundFunction')
    const NUM_OF_ROUNDS = 16
    for (const block of this.blocks) {
        for (let round = 0; round < NUM_OF_ROUNDS; round++) {
            const originalR = [...block.R]
            // FIXME: refactor
            // 0.008 ms
            // console.time('roundFunction: E')
            block.R = E(block)
            // console.timeEnd('roundFunction: E')
            
            // 0.004 ms
            // console.time('roundFunction: xorWhitener')
            block.R = xorWhitener.call(this, block.R, round)
            // console.timeEnd('roundFunction: xorWhitener')

            // 0.005 ms
            // console.time('roundFunction: splitRTo6BitChunks')
            block.R = splitRTo6BitChunks(block.R)
            // console.timeEnd('roundFunction: splitRTo6BitChunks')

            block.R = sBox(block.R)

            // 0.007 ms
            // console.time('roundFunction: pBox')
            block.R = pBox(block.R)
            // console.timeEnd('roundFunction: pBox')

            // 0.004 ms
            // block parts for the next round:
            // console.time('roundFunction: getNewR')
            block.R = getNewR(block)
            // console.timeEnd('roundFunction: getNewR')

            block.L = [...originalR]
        }
    }
    // final swap!
    finalSwap.call(this)
    
    this.status.push('ROUND FUNCTION')
    console.timeEnd('roundFunction')
    return this
}

module.exports = roundFunction