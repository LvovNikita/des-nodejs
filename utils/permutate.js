const bufferToBinary = require('./bufferToBinary')
const binaryToBuffer = require('./binaryToBuffer')

module.exports = (src, pbox) => {
    if (!Array.isArray(pbox)) {
        throw new TypeError('pbox expected to be an array')
    }
    if (!Buffer.isBuffer(src)) {
        throw new TypeError('src expected to be a buffer')
    }
    src = bufferToBinary(src)
    const result = []
    for (const pos of pbox) {
        result.push(src[pos])
    }
    return binaryToBuffer(result)
}