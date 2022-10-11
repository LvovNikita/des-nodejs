'use strict'

const { StringDecoder } = require('node:string_decoder');

// DES tables
const _PC2 = require('./tables/PC-2')
const _FP = require('./tables/IP-1')

// Libs
const allocateKey = require('./lib/allocateKey')
const allocateBlocks = require('./lib/allocateBlocks')
const blocksToBinary = require('./lib/blocksToBinary')
const initialPermutation = require('./lib/initialPermutation')
const getBlocksHalves = require('./lib/getBlocksHalves')
const generateRoundKeys = require('./lib/generateRoundKeys')
const roundFunction = require('./lib/roundFunction')

// Utils
const permutate = require('./utils/permutate')

class DES {
    static allocateKey = allocateKey
    static generateRoundKeys = generateRoundKeys

    constructor(key) {    
        this.key = DES.allocateKey(key)                     // Array<number>
        this.roundKeys = DES.generateRoundKeys(this.key)    // Array<Array<number>>
        this.status = ['ALLOCATE KEY']
        this.input = null
        this.blocks = []
    }
    
    #allocateBlocks = allocateBlocks
    #blocksToBinary = blocksToBinary
    #ip = initialPermutation
    #getBlocksHalves = getBlocksHalves
    #f = roundFunction

    #fp() {
        this.blocks = this.blocks
            .map(blockArr => permutate(blockArr, _FP))
        return this
    }

    #blocksToBuffer() {
        // const BYTES = 8
        // for (const block of this.blocks) {
        //     const result = []
        //     for (let i = 0; i < BYTES; i++) {
        //         result.push(this.block
        //             .slice(i * 8, (i + 1) * 8) // TODO: REFACTOR i
        //             // .reduce((prev, curr) => prev + curr)
        //         )
        //     }
        //     result = result.map(elem => parseInt(elem, 2))
        //     // const decoder = new StringDecoder('utf16le')
        //     // this.block = Buffer.from(result)
        //     // this.blockAsString = decoder.write(this.block)
        // }
        
        return this
    }

    encrypt(buffer, mode = 'ECB') {
        this.input = buffer
        this
            .#allocateBlocks()  // block: Array<buffer>
            .#blocksToBinary()  // block: Array<number>
            .#ip()              // block: Array<number>
            .#getBlocksHalves() // block: Object {L: Array<number>, R: Array<number} 
            .#f()
            .#fp()
            .#blocksToBuffer()
        // return this
        console.log('ENCRYPT!')
    }

    decrypt() {
        // this.block = this.ciphertext // TODO: get from outside
        // this.status = [] // FIXME: 
        // this
        //     .#byteBlockToBinary()
        //     .#ip()
        //     .#getBlockHalves()
        //     .f(true) // TODO: wrapper instead of argument
        //     .fp(true)
        //     .transformBinaryBlockToBytes(true)
        console.log('DECRYPT!')
    }

    static showWarnings = false
}

module.exports = DES

// static get _IP() { return _IP }