'use strict'

const bufferToBinary = require('./bufferToBinary')

module.exports = (src, pbox) => {
    if (!Array.isArray(pbox)) {
        throw new TypeError('pbox expected to be an array')
    }
    if (!Buffer.isBuffer(src)) {
        throw new TypeError('src expected to be a buffer')
    }
    src = bufferToBinary(src)
    let result = new Array(7).fill(null).map(elem => [])
    for (let i = 0; i < pbox.length; i++) {
        result[~~(i / 8)].push(src[pbox[i]])
    }
    result = result
        .map(elem => parseInt(elem.join(''), 2))
    return Buffer.from(result)
}