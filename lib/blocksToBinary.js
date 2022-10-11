const bufferToBinary = require('../utils/bufferToBinary')

const blocksToBinary = function () {
    this.blocks = this.blocks
        .map(blockBuff => bufferToBinary(blockBuff)) // FIXME: is really Array<Array<number>>?
    this.status.push('BLOCKS TO BINARY')
    return this
}

module.exports = blocksToBinary