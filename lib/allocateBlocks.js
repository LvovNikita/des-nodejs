const padBufferLeft = require('../utils/padBufferLeft')

const allocateBlocks = function () {
    if (typeof this.data === 'string' || Buffer.isBuffer(this.data)) {
        // FIXME: refactor
        if (typeof this.data === 'string') {
            this.data = Buffer.from(this.data)
        }
        this.data = padBufferLeft(this.data) // buffer
        for (let i = 0; i < this.data.length; i += 8) {
            const chunk = this.data.slice(i, i + 8) 
            this.blocks.push(chunk) // Array<buffer 64 bit>
        }
        this.status.push('ALLOCATE BLOCKS')
        return this
    }
    else {
        throw new TypeError('Data must be a block or a buffer')
    }
}

module.exports = allocateBlocks