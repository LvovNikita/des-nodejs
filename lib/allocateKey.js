const bufferToBinary = require('../utils/bufferToBinary')
const getParityBit = require('../utils/getParityBit')

/**
 * @param {(string|buffer)} key 56 bit
 * @returns {Array<number>} 64 bit
 */
const allocateKey = (key) => {
    // console.time('allocateKey')
    const KEY_SIZE = 7 // bytes
    if (typeof key === 'string' || Buffer.isBuffer(key)) {
        if (Buffer.from(key).length !== KEY_SIZE) {
            console.warn('🔑 Warning: non-56-bit key provided')
            console.warn('🔑 Warning: key will be truncated or repeated')
        }
        const buff = Buffer.alloc(KEY_SIZE, key)
        const bin = bufferToBinary(buff)
        const tempBin = []
        const CHUNK_SIZE = 7 // bits
        for (let i = 0; i < bin.length; i += CHUNK_SIZE) addParityBits:{
            const chunk = bin.slice(i, i + CHUNK_SIZE)
            const parityBit = getParityBit(chunk)
            chunk.push(parityBit)
            tempBin.push(chunk)
        }
        // console.timeEnd('allocateKey')
        return tempBin.flat() // binary array
    } else {
        throw new TypeError('Key must be a string or a buffer')
    }
}

module.exports = allocateKey