const _IP = require('../tables/IP')

const permutate = require('../utils/permutate')

const initialPermutation = function () {
    this.blocks = this.blocks
        .map(blockArr => permutate(blockArr, _IP)) // Array<number> 64 bit
    return this
}

module.exports = initialPermutation