const getBlocksHalves = function () {
    const BLOCK_SIZE = 64 // bits
    const HALF_SIZE = BLOCK_SIZE/2 // bits
    this.blocks = this.blocks
        .map(blockArr => ({ 
            L: blockArr.slice(0, HALF_SIZE), 
            R: blockArr.slice(HALF_SIZE) 
        })) // Object {L: Array<number>, R: Array<number}
    this.status.push('GET BLOCKS HALVES')
    return this
}

module.exports = getBlocksHalves