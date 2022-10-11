const padBufferLeft = require('../utils/padBufferLeft')

const allocateBlocks = function () {
    this.input = padBufferLeft(this.input)
    for (let i = 0; i < this.input.length; i += 8) {
        const chunk = this.input.slice(i, i + 8) 
        this.blocks.push(chunk) // Array<buffer>
    }
    this.status.push('ALLOCATE BLOCKS')
    return this
}

module.exports = allocateBlocks