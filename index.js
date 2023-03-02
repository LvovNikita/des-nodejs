'use strict'

const { StringDecoder } = require('node:string_decoder')

const allocateKey = require('./lib/allocateKey')
const allocateBlocks = require('./lib/allocateBlocks')
const blocksToBinary = require('./lib/blocksToBinary')
const initialPermutation = require('./lib/initialPermutation')
const getBlocksHalves = require('./lib/getBlocksHalves')
const generateRoundKeys = require('./lib/generateRoundKeys')
const roundFunction = require('./lib/roundFunction')
const finalPermutation = require('./lib/finalPermutation')
const blocksToBuffer = require('./lib/blocksToBuffer')

class DES {
    static allocateKey = allocateKey
    static generateRoundKeys = generateRoundKeys

    /**
     * @param {(buffer|string)} key 
     */
    constructor(key) {
        this.key = DES.allocateKey(key)                     // Array<number>
        this.roundKeys = DES.generateRoundKeys(this.key)    // Array<Array<number>>
        // this.status = ['ALLOCATE KEY']
        this.data = null
        this.blocks = []
    }
    
    // Private methods:

    #allocateBlocks = allocateBlocks
    #blocksToBinary = blocksToBinary
    #ip = initialPermutation
    #getBlocksHalves = getBlocksHalves
    #f = roundFunction
    #fp = finalPermutation
    #blocksToBuffer = blocksToBuffer

    // Public methods:

    /**
     * @param {(buffer|string)} plaintext 
     */
    encrypt(plaintext) {
        this.blocks = []
        this
            .#allocateBlocks(plaintext)  // block: Array<buffer>
            // .#blocksToBinary()  // block: Array<number>
            // .#ip()              // block: Array<number>
            // .#getBlocksHalves() // block: Object {L: Array<number>, R: Array<number} 
            // .#f()
            // .#fp()
            // .#blocksToBuffer()
        return this
    }

    /**
     * @param {(buffer|string)} plaintext 
     */
    decrypt(ciphertext) {
        this.roundKeys.reverse()
        this.encrypt(ciphertext)
        return this
    }

    // Getters:

    get dataAsString() {
        const decoder = new StringDecoder('utf8')
        return decoder.write(this.data)
    }
}

module.exports = DES