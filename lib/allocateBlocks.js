'use strict'

const padBufferLeft = require('../utils/padBufferLeft')

const allocateBlocks = function (plaintext) {
    // console.time('allocateBlocks')
    this.data = Buffer.from(plaintext)
    while (this.data.byteLength % 8 !== 0) {
        this.data = Buffer.concat([Buffer.alloc(1), this.data])
    }
    for (let i = 0; i < this.data.byteLength / 8; i ++) {
        this.blocks.push(this.data.subarray(i * 8, i * 8 + 8))
    }
    // TODO:
    // {
    //     throw new TypeError('Data must be a block or a buffer')
    // }
    // this.status.push('ALLOCATE BLOCKS')
    // console.timeEnd('allocateBlocks')
    return this
}

console.dir(allocateBlocks.call({blocks: []}, 'hello world'))

module.exports = allocateBlocks