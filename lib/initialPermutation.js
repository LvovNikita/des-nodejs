'use strict'

const _IP = require('../tables/IP')

const permutate = require('../utils/permutate')

const initialPermutation = function () {
    this.blocks = this.blocks
        .map(blockArr => permutate(blockArr, _IP))
    
    this.status.push('INITIAL PERMUTATION')
    return this
}

module.exports = initialPermutation