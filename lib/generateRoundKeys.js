const _PC1 = require('../tables/PC-1')
const _PC2 = require('../tables/PC-2')

const permutate = require('../utils/permutate')
const leftShift = require('../utils/arrayLeftShift')

generateRoundKeys = function (key) {
    // console.time('generateRoundKeys')
    // PC1: 64-bit key -> 56-bit key      
    const keyAfterPC1 = permutate(key, _PC1) // Array<number> 56 bit
    // getKeyHalves: 56-bit key -> 2 x 28-bit keys
    const KEY_SIZE = 56 // bits
    const HALF_KEY_SIZE = KEY_SIZE/2
    const Ci = [keyAfterPC1.slice(0, HALF_KEY_SIZE)]    // init with C0 28 bit
    const Di = [keyAfterPC1.slice(HALF_KEY_SIZE)]       // init with D0 28 bit
    // generateRoundKeys: -> 16 x 56-bit keys
    const NUM_OF_ROUNDS = 16
    const ONE_BIT_SHIFT_ROUNFS = [1, 2, 9, 16]
    const roundKeys = []
    for (let i = 1; i <= NUM_OF_ROUNDS; i++) {
        const shiftAmount = ONE_BIT_SHIFT_ROUNFS.includes(i) ? 1 : 2
        Ci.push(leftShift(Ci[i - 1], shiftAmount))
        Di.push(leftShift(Di[i - 1], shiftAmount))
        roundKeys.push([...Ci[i], ...Di[i]]) // 56 bit
    }
    // PC2: 56-bit key -> 48-bit key
    const ret = roundKeys
        .map(keyArr => permutate(keyArr, _PC2)) // Array<Array<number> 48-bit>
    // console.timeEnd('generateRoundKeys') 
    return ret
}

module.exports = generateRoundKeys