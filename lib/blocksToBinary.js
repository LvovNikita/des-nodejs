'use strict'

const bufferToBinary = require('../utils/bufferToBinary')

const blocksToBinary = function () {
    // console.time('blocksToBinary')
    this.blocks = this.blocks
        .map(blockBuff => bufferToBinary(blockBuff))
        
    this.status.push('BLOCKS TO BINARY')
    // console.timeEnd('blocksToBinary')
    return this
}

module.exports = blocksToBinary