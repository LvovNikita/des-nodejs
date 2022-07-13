'use strict'

const _IP = require('./tables/IP')
const _PC1 = require('./tables/PC-1')
const _PC2 = require('./tables/PC-2')
const _S = require('./tables/S-Boxes')
const _P = require('./tables/P')
const _E = require('./tables/E')
const _FP = require('./tables/IP-1')
const fs = require('fs')

const byteToBinary = byte => byte.toString(2).padStart(8, 0)

class DES {
    constructor(block, key) {
        this.status = ['INIT & ALLOCATE_KEY']
        this.key = DES.allocateKey(key)
        this.block = block
    }

    /**
     * Returns plaintext's blocks
     * @param { String } path 
     * @returns { Promise } Array of 64-bit blocks (Buffers) or Error
     */
    static getBlocks(path) {
        return new Promise((resolve, reject) => {
            const blocks = []
            if (!fs.existsSync(path)) {
                reject(new Error('Please provide the correct file path'))
            }
            const file = fs
            .createReadStream(path)
            .on('readable', () => {
                let block
                // read 64-bits blocks
                while (block = file.read(8)) {
                    blocks.push(block)
                }
            })
            .on('end', () => {
                resolve(blocks)
            })
            .on('error', () => {
                reject(new Error('Something went wrong during the file reading'))
            }) 
        })
    }

    /**
     * Gets key
     * @param { (String | Buffer) } key 
     * @returns { Buffer } 7 byte key (Buffer) or Error 
     */
    static allocateKey = (key) => {
        const KEY_SIZE_BYTES = 7
        if (typeof key === 'string' || Buffer.isBuffer(key)) {
            if (Buffer.from(key).length !== KEY_SIZE_BYTES && DES.showWarnings) {
                console.warn('Warning: Provided key length isn\'t equal to 56 bits, so it will be truncated or repeated')
            }
            return key = Buffer.alloc(KEY_SIZE_BYTES, key)
        } else {
            throw new Error('Key must be a string or a buffer')
        }
    }

    /**
     * Transforms 8 byte block to 64 bits block
     * @returns { this }
     */
    transformByteBlockToBinary() {
        const blockAsBinaryArray = Array
            .from(this.block)
            .map(byte => byteToBinary(byte))
            .reduce((prev, curr) => prev + curr)
            .split('')
        this.block = blockAsBinaryArray
        this.status.push('TRANSOFRM_BYTE_BLOCK_TO_BINARY')
        if (this.block.length !== 64) {
            throw new Error('Something went wrong during the byte block to binary transforamtion')
        }
        return this
    }

    /**
     * Initial Permutation
     * @returns { this }
     */
    ip() {
        const BLOCK_SIZE_BITS = 64
        const blockAfterIP = new Array(BLOCK_SIZE_BITS)
        for (let i = 0; i < BLOCK_SIZE_BITS; i++) {
            blockAfterIP[i] = this.block[_IP[i]]
        }
        this.block = blockAfterIP
        this.status.push('INITIAL_PERMUTATION')
        return this
    }

    /**
     * Get block halves (L0 and R0)
     * @returns {this}
     */
    getBlockHalves () {
        this.L = this.block.slice(0, 32)
        this.R = this.block.slice(32)
        this.status.push('GET_BLOCK_HALVES_L_R')
        return this
    }

    encrypt() {
        this
            .transformByteBlockToBinary()
            .ip()
            .getBlockHalves()
        return this
    }

    static showWarnings = false
}

module.exports = DES

// static get _IP() { return _IP }

// NOTES:

// getRoundKeys(PC1cb, PC2cb, PC1table, PC2table)
// F(Ecb, Scb, Pcb, Etable, Stable, Ptable)
// FP(FPtable)
// PC1(PC1table)
// PC2(PC2table)
// E(Etable)
// S(Stable)
// P(Ptable)

// DES.encrypt(data, key) = 
// getData(data)
// .getKey(key)
// .IP(IPtable)
// .getBlocksHalves()
// .getRoundKeys(PC1, PC2, PC1table, PC2table)
// .F(E, S, P, Etable, Stable, Ptable)
// .FP(FPtable)
