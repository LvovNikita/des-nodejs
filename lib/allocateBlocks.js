const padBufferLeft = require('../utils/padBufferLeft')

const allocateBlocks = function () {
    this.data = padBufferLeft(this.data)
    for (let i = 0; i < this.data.length; i += 8) {
        const chunk = this.data.slice(i, i + 8) 
        this.blocks.push(chunk) // Array<buffer>
    }
    this.status.push('ALLOCATE BLOCKS')
    return this
}

module.exports = allocateBlocks