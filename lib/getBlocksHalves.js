'use strict'

const getBlocksHalves = function () {
    // console.time('getBlocksHalves')
    const BLOCK_SIZE = 64 // bits
    const HALF_SIZE = BLOCK_SIZE/2 // bits
    this.blocks = this.blocks
        .map(blockArr => ({ 
            L: blockArr.slice(0, HALF_SIZE), 
            R: blockArr.slice(HALF_SIZE) 
        }))
    
    this.status.push('GET BLOCKS HALVES')
    // console.timeEnd('getBlocksHalves')
    return this
}

module.exports = getBlocksHalves