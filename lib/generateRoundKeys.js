const _PC1 = require('../tables/PC-1')
const _PC2 = require('../tables/PC-2')

const permutate = require('../utils/permutate')
const leftShift = require('../utils/arrayLeftShift')

/**
 * @param {Array<number>} key
 * @returns {Array<Array<number>>}
 */

generateRoundKeys = function (key) {
    // PC1: 64-bit key -> 56-bit key        
    const keyAfterPC1 = permutate(key, _PC1) // Array<number> 56 bit
    // getKeyHalves
    const KEY_SIZE = 56 // bits
    const HALF_KEY_SIZE = KEY_SIZE/2
    const Ci = [keyAfterPC1.slice(0, HALF_KEY_SIZE)]    // init with C0
    const Di = [keyAfterPC1.slice(HALF_KEY_SIZE)]       // init with D0
    // generateRoundKeys
    const NUM_OF_ROUNDS = 16
    const ONE_BIT_SHIFT_ROUNFS = [1, 2, 9, 16]
    const roundKeys = []
    for (let i = 1; i <= NUM_OF_ROUNDS; i++) {
        const shiftAmount = ONE_BIT_SHIFT_ROUNFS.includes(i) ? 1 : 2 // bits
        Ci.push(leftShift(Ci[i - 1], shiftAmount))
        Di.push(leftShift(Di[i - 1], shiftAmount))
        roundKeys.push([...Ci[i], ...Di[i]])   
    }
    // PC2: 56-bit key -> 48-bit key 
    return roundKeys
        .map(keyArr => permutate(keyArr, _PC2)) // Array<Array<number>>
}

module.exports = generateRoundKeys