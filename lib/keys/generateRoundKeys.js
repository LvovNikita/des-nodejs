const _PC1 = require('../../tables/PC-1')
const _PC2 = require('../../tables/PC-2')

const permutate = require('../../utils/permutate')
const leftShift = require('../../utils/arrayLeftShift')
const bufferToBinary = require('../../utils/bufferToBinary')
const binaryToBuffer = require('../../utils/binaryToBuffer')

// TODO: decompose
generateRoundKeys = function (key) {
    console.time('generateRoundKeys')
    // PC1: 64-bit key -> 56-bit key      
    const keyAfterPC1 = permutate(key, _PC1) // Array<number> 56 bit
    // getKeyHalves: 56-bit key -> 2 x 28-bit keys
    const C0 = bufferToBinary(Buffer.from(keyAfterPC1.subarray(0, 4)))
        .slice(0, 28)
    const Ci = [C0]
    const D0 = bufferToBinary(Buffer.from(keyAfterPC1.subarray(3)))
        .slice(4)
    const Di = [D0]
    // generateRoundKeys: -> 16 x 56-bit keys
    const NUM_OF_ROUNDS = 16
    const ONE_BIT_SHIFT_ROUNFS = [1, 2, 9, 16]
    let roundKeys = []
    for (let i = 1; i <= NUM_OF_ROUNDS; i++) {
        const shiftAmount = ONE_BIT_SHIFT_ROUNFS.includes(i) ? 1 : 2
        Ci.push(leftShift(Ci[i - 1], shiftAmount))
        Di.push(leftShift(Di[i - 1], shiftAmount))
        roundKeys.push([...Ci[i], ...Di[i]]) // 56 bit
    }
    // PC2: 56-bit key -> 48-bit key
    const result = roundKeys
        .map(key => binaryToBuffer(key))
        .map(keyBuff => permutate(keyBuff, _PC2)) 
        .map(keyBuff => keyBuff.subarray(0, 6)) // Array<Array<number> 48-bit>
    console.timeEnd('generateRoundKeys') 
    return result
}

module.exports = generateRoundKeys