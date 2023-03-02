'use strict'

const { StringDecoder } = require('node:string_decoder')

const allocateKey = require('./lib/allocateKey')
const allocateBlocks = require('./lib/allocateBlocks')
const initialPermutation = require('./lib/initialPermutation')
const getBlocksHalves = require('./lib/getBlocksHalves')
const generateRoundKeys = require('./lib/generateRoundKeys')
const roundFunction = require('./lib/roundFunction')
const finalPermutation = require('./lib/finalPermutation')
const joinBlocks = require('./lib/joinBlocks')

class DES {
    static allocateKey = allocateKey
    static generateRoundKeys = generateRoundKeys

    constructor(key) { // :string
        this.key = DES.allocateKey(key)                     
        this.roundKeys = DES.generateRoundKeys(this.key)
        this.status = ['ALLOCATE KEY']
        this.data = null
        this.blocks = []
    }
    
    // Private methods:

    #allocateBlocks = allocateBlocks
    #ip = initialPermutation
    #getBlocksHalves = getBlocksHalves
    #f = roundFunction
    #fp = finalPermutation
    #joinBlocks = joinBlocks

    // Public methods:

    encrypt(plaintext) { // :buffer | string
        this.blocks = []
        this
            .#allocateBlocks(plaintext)  
            .#ip()              
            .#getBlocksHalves()
            .#f()
            .#fp()
            .#joinBlocks()
        return this
    }

    decrypt(ciphertext) { // :buffer | string
        this.roundKeys.reverse()
        this.encrypt(ciphertext)
        return this
    }

    get dataAsString() {
        const decoder = new StringDecoder('utf8')
        return decoder.write(this.data)
    }
}

module.exports = DES