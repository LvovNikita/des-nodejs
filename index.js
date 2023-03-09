'use strict'

const { StringDecoder } = require('node:string_decoder')

const allocateKey = require('./lib/keys/allocateKey')
const allocateBlocks = require('./lib/blocks/allocateBlocks')
const initialPermutation = require('./lib/permutations/initialPermutation')
const getBlocksHalves = require('./lib/blocks/getBlocksHalves')
const generateRoundKeys = require('./lib/keys/generateRoundKeys')
const roundFunction = require('./lib/roundFunction')
const finalPermutation = require('./lib/permutations/finalPermutation')
const joinBlocks = require('./lib/blocks/joinBlocks')

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
    
    #allocateBlocks = allocateBlocks
    #ip = initialPermutation
    #getBlocksHalves = getBlocksHalves
    #f = roundFunction
    #fp = finalPermutation
    #joinBlocks = joinBlocks

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