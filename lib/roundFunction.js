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
    // console.log(this)
    for (const block of this.blocks) {
        for (let round = 0; round < NUM_OF_ROUNDS; round++) {
            const originalR = Buffer.from(block.R)

            // console.time('roundFunction: E')
            block.R = E(block.R)
            // console.timeEnd('roundFunction: E')
            
            // console.time('roundFunction: xorWhitener')
            block.R = xorWhitener.call(this, block.R, round)
            // console.timeEnd('roundFunction: xorWhitener')
            
            // console.time('roundFunction: splitRTo6BitChunks')
            block.R = splitRTo6BitChunks(block.R)
            // console.timeEnd('roundFunction: splitRTo6BitChunks')
            
            // console.time('roundFunction: sBox')
            block.R = sBox(block.R)
            // console.timeEnd('roundFunction: sBox')

            // console.time('roundFunction: pBox')
            block.R = pBox(block.R)
            // console.timeEnd('roundFunction: pBox')
            
            // console.time('roundFunction: getNewR')
            block.R = getNewR(block)
            // console.timeEnd('roundFunction: getNewR')

            block.L = Buffer.from(originalR)
        }
    }
    finalSwap.call(this)
    this.status.push('ROUND FUNCTION')
    console.timeEnd('roundFunction')
    return this
}

module.exports = roundFunction

// SLOW PERFORMANCE:
// 1. splitRTo6BitChunks = 0.1ms
// 2. E = 0.09ms
// 3. pBox = 0.05ms
// 4. sBox = 0.04ms
// 5. xorWhitener = 0.01ms
// 6. getNewR = 0.01ms