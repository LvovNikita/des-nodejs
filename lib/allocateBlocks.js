const padBufferLeft = require('../utils/padBufferLeft')

const allocateBlocks = function () {
    if (typeof this.data === 'string') {
        this.data = Buffer.from(this.data)
    } 

    if (Buffer.isBuffer(this.data)) {
        this.data = padBufferLeft(this.data) // buffer
        for (let i = 0; i < this.data.length; i += 8) {
            const block = this.data.subarray(i, i + 8) 
            this.blocks.push(block)
        }
    }
    else {
        throw new TypeError('Data must be a block or a buffer')
    }
    
    this.status.push('ALLOCATE BLOCKS')
    return this
}

module.exports = allocateBlocks