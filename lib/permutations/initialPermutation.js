const _IP = require('../../tables/IP')
const permutate = require('../../utils/permutate')

const initialPermutation = function () {
    console.time('initialPermutation')
    this.blocks = this.blocks
        .map(block => permutate(block, _IP))
    
    this.status.push('INITIAL PERMUTATION')
    console.timeEnd('initialPermutation')
    return this
}

module.exports = initialPermutation