'use strict'

const isNumber = require('./isNumber')

module.exports = (src, pbox) => {
    if (!(Array.isArray(src) && Array.isArray(pbox))) {
        throw new TypeError('args expected to be arrays')
    }
    else if (!pbox.every(elem => isNumber(elem))) {
        throw new TypeError('pbox should be an array of numbers')
    }

    const result = []
    for (let i = 0; i < pbox.length; i++) {
        result[i] = src[pbox[i]]
    }
    return result
}