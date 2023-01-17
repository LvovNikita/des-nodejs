const _FP = require('../tables/IP-1')

const permutate = require('../utils/permutate')

const finalPermutation = function () {
    // console.time('finalPermutation')
    this.blocks = this.blocks
        .map(blockArr => permutate(blockArr, _FP))
    // console.timeEnd('finalPermutation')
    return this
}

module.exports = finalPermutation