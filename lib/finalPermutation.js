const _FP = require('../tables/IP-1')

const permutate = require('../utils/permutate')

const finalPermutation = function () {
    this.blocks = this.blocks
        .map(blockArr => permutate(blockArr, _FP))
    return this
}

module.exports = finalPermutation