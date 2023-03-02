const bufferToBinary = require('../utils/bufferToBinary')
const getParityBit = require('../utils/getParityBit')

/**
 * @param {(string|buffer)} key 56 bit
 * @returns {Array<number>} 64 bit
 */
const allocateKey = (key) => {
    // console.time('allocateKey')
    if (typeof key === 'string' || Buffer.isBuffer(key)) {
        const KEY_SIZE = 7 // bytes
        if (Buffer.from(key).length !== KEY_SIZE) {
            console.warn('🔑 Warning: non-56-bit key provided')
            console.warn('🔑 Warning: key will be truncated or repeated')
        }
        const buff = Buffer.alloc(KEY_SIZE, key)
        // FIXME: slow
        const tempBin = bufferToBinary(buff)
        let bin = []
        while (tempBin.length) {
            bin.push(tempBin.splice(0, 7))
        }
        bin = bin.flatMap(arr => {
            arr.push(getParityBit(arr))
            return parseInt(arr.join(''), 2) 
        })
        // console.timeEnd('allocateKey')
        return Buffer.from(bin)
    } else {
        throw new TypeError('Key must be a string or a buffer')
    }
}

// console.log(allocateKey('SECRETK'))

module.exports = allocateKey