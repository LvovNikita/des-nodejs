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
const arrayLeftShift = (arr, shiftAmountOfBits) => [...arr.slice(shiftAmountOfBits), ...arr.slice(0, shiftAmountOfBits)]
// const bufferToBinaryArray = () => {}
const permutate = (src, pbox) => {
    const result = []
    for (let i = 0; i < pbox.length; i++) {
        result[i] = src[pbox[i]]
    }
    return result
}

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
        const KEY_SIZE_BYTES = 8
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
    #transformByteBlockToBinary() {
        const BLOCK_SIZE_BITS = 64
        const blockAsBinaryArray = Array
            .from(this.block)
            .map(byte => byteToBinary(byte))
            .reduce((prev, curr) => prev + curr)
            .split('')
        this.block = blockAsBinaryArray
        this.status.push('TRANSOFRM_BYTE_BLOCK_TO_BINARY')
        if (this.block.length !== BLOCK_SIZE_BITS) {
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
        // for (let i = 0; i < BLOCK_SIZE_BITS; i++) {
        //     blockAfterIP[i] = this.block[_IP[i]]
        // }
        // this.block = blockAfterIP
        this.block = permutate(this.block, _IP)
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
        delete this.block
        this.status.push('GET_BLOCK_HALVES_L_R')
        return this
    }

    transformByteKeyToBinary() {
        // TODO: вынести в отдельную функция bufferToBinaryArray()
        const KEY_SIZE_BITS = 64
        const keyAsBinaryArray = Array
            .from(this.key)
            .map(byte => byteToBinary(byte))
            .reduce((prev, curr) => prev + curr)
            .split('')
        this.key = keyAsBinaryArray
        this.status.push('|- KEYS: TRANSOFRM_BYTE_KEY_TO_BINARY')
        if (this.key.length !== KEY_SIZE_BITS) {
            throw new Error('Something went wrong during the byte key to binary transforamtion')
        }
        return this
    }

    pc1() {
        const KEY_SIZE_BITS_AFTER_PC1 = 56
        // const keyAfterPC1 = new Array(KEY_SIZE_BITS_AFTER_PC1)
        // for (let i = 0; i < KEY_SIZE_BITS_AFTER_PC1; i++) {
        //     keyAfterPC1[i] = this.key[_PC1[i]]
        // }
        const keyAfterPC1 = permutate(this.key, _PC1)
        this.key = keyAfterPC1
        this.status.push('|- KEYS: PC-1_KEY_BITS_PERMUTATION')
        return this
    }

    getKeyHalves() {
        this.Ci = [this.key.slice(0, 28)]
        this.Di = [this.key.slice(28)]
        this.status.push('|- KEYS: GET_KEY_HALVES_C0_D0')
        return this
    }

    initRoundKeys() {
        const NUM_OF_ROUNDS = 16
        const ROUNDS_WITH_ONE_BIT_SHIFT = [1, 2, 9, 16]
        this.roundKeys = []
        let shiftAmountOfBits
        for (let i = 1; i <= NUM_OF_ROUNDS; i++) {
            shiftAmountOfBits = 2
            if (ROUNDS_WITH_ONE_BIT_SHIFT.includes(i)) shiftAmountOfBits = 1
            this.Ci.push(arrayLeftShift(this.Ci[i - 1], shiftAmountOfBits))
            this.Di.push(arrayLeftShift(this.Di[i - 1], shiftAmountOfBits))
            this.roundKeys.push([...this.Ci[i], ...this.Di[i]])   
        }
        delete this.Ci
        delete this.Di
        this.status.push('|- KEYS: INIT_ROUND_KEYS')
        return this
    }

    pc2() {
        const NUM_OF_ROUND_KEYS = 16
        for (let i = 0; i < NUM_OF_ROUND_KEYS; i++) {
            this.roundKeys[i] = permutate(this.roundKeys[i], _PC2)
        }
        this.status.push('|- KEYS: PC-2_ROUND_KEYS_BITS_PERMUTATION')
        return this
    }  

    generateRoundKeys() {
        this
            .transformByteKeyToBinary()
            .pc1()
            .getKeyHalves()
            .initRoundKeys()
            .pc2()
        this.status.push('|- KEYS: DONE!')
        return this
    }

    f() {
        const NUM_OF_ROUNDS = 16
        const expand = permutate
        this.R_chunks = []
        for (let i = 0; i < NUM_OF_ROUNDS; i++) {
            // Li+1 = R i
            this.L_prev = [...this.L]
            this.L = this.R
            // expand R
            this.R = expand(this.R, _E)
            // xor R with round key
            this.R.map((bit, index) => bit ^ this.roundKeys[i][index])
            // splitRto8chunksOfbits 
            const NUM_OF_CHUNKS = 8
            const CHUNK_SIZE_BITS = 6
            this.R_chunks.push([])
            for (let j = 0; j < NUM_OF_CHUNKS; j++) {
                const chunkStartPos = j * CHUNK_SIZE_BITS
                const chunkEndPos = (j + 1) * CHUNK_SIZE_BITS
                this.R_chunks[i].push(this.R.slice(chunkStartPos, chunkEndPos))
            }
            // S boxes
            this.R_chunks[i].map((chunk, index) => {
                const row = parseInt(chunk[0] + chunk[5], 2)
                const column = parseInt(chunk.slice(1, 5).reduce((prev, curr) => prev + curr), 2)
                return Array.from(_S[index][row][column].toString(2).padStart(4, '0'))
            }) 
            this.R = this.R_chunks[i].flat()
            // P boxes
            this.R = permutate(this.R, _P)
            // join
            this.R.map((bit, index) => bit ^ this.L_prev[index])
        }
        delete this.L_prev
        delete this.R_chunks
        this.ciphertext = [...this.L, ...this.R] 
        delete this.L
        delete this.R
        return this
    }

    fp() {
        this.ciphertext = permutate(this.ciphertext, _FP)
        return this
    }

    transformBinaryBlockToBytes() {
        const BYTES = 8
        const result = []
        for (let i = 0; i < BYTES; i++) {
            result.push(this.ciphertext
                .slice(i * 8, (i + 1) * 8)
                .reduce((prev, curr) => prev + curr)
            )
        }
        this.ciphertext = Buffer.from(result)
        this.ciphertextAsString = this.ciphertext.toString()
        return this
    }

    encrypt() {
        this
            .#transformByteBlockToBinary()
            .ip()
            .getBlockHalves()
            .generateRoundKeys()
            .f()
            .fp()
            .transformBinaryBlockToBytes()
        return this
    }

    static showWarnings = false
}

module.exports = DES

// static get _IP() { return _IP }

// NOTES:
// F(Ecb, Scb, Pcb, Etable, Stable, Ptable)
// FP(FPtable)
// P(Ptable)
