const getBlocksHalves = function () {
    console.time('getBlocksHalves')
    const BLOCK_SIZE = 8 // bytes
    const HALF_SIZE = BLOCK_SIZE / 2 // bytes
    this.blocks = this.blocks
        .map(block => ({ 
            L: block.subarray(0, HALF_SIZE), 
            R: block.subarray(HALF_SIZE) 
        }))
    this.status.push('GET BLOCKS HALVES')
    console.timeEnd('getBlocksHalves')
    return this
}

module.exports = getBlocksHalves