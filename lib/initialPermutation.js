'use strict'

const _IP = require('../tables/IP')

const permutate = require('../utils/permutate')

const initialPermutation = function () {
    // console.time('initialPermutation')
    this.blocks = this.blocks
        .map(blockArr => permutate(blockArr, _IP))
    
    this.status.push('INITIAL PERMUTATION')
    // console.timeEnd('initialPermutation')
    return this
}

module.exports = initialPermutation