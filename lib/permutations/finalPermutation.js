const _FP = require('../../tables/IP-1')

const permutate = require('../../utils/permutate')

const finalPermutation = function () {
    console.time('finalPermutation')
    this.blocks = this.blocks
        .map(block => permutate(block, _FP))
    console.timeEnd('finalPermutation')
    return this
}

module.exports = finalPermutation