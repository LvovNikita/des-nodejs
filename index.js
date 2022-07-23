'use strict'

// DES tables
const _IP = require('./tables/IP')
const _PC1 = require('./tables/PC-1')
const _PC2 = require('./tables/PC-2')
const _S = require('./tables/S-Boxes')
const _P = require('./tables/P')
const _E = require('./tables/E')
const _FP = require('./tables/IP-1')
const fs = require('fs')

// Utils
const arrayLeftShift = require('./utils/arrayLeftShift')
const bufferToBinaryArray = require('./utils/bufferToBinaryArray')
const permutate = require('./utils/permutate')

class DES {
    constructor(block, key) {
        this.status = ['INIT & ALLOCATE_KEY']
        this.key = DES.allocateKey(key)
        if (!Buffer.isBuffer(block) || !Buffer.length === 8) {
            throw new Error('Block must be a 8-byte Buffer')
        }
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
        // Todo: get 56 bits key and add parity bits to length 64
        const KEY_SIZE_BYTES = 8
        if (typeof key === 'string' || Buffer.isBuffer(key)) {
            if (Buffer.from(key).length !== KEY_SIZE_BYTES && DES.showWarnings) {
                console.warn('Warning: Provided key length isn\'t equal to 64 bits, so it will be truncated or repeated')
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
    #byteBlockToBinary() {
        const BLOCK_SIZE_BITS = 64
        this.block = bufferToBinaryArray(this.block)
        if (this.block.length !== BLOCK_SIZE_BITS) {
            throw new Error('Something went wrong during the byte block to binary transforamtion')
        }
        this.status.push('TRANSOFRM_BYTE_BLOCK_TO_BINARY')
        return this
    }

    /**
     * Initial Permutation (IP)
     * @returns { this }
     */
    #ip() {
        this.block = permutate(this.block, _IP)
        this.status.push('INITIAL_PERMUTATION')
        return this
    }

    /**
     * Get 32-bits block halves (L0 and R0)
     * @returns { this }
     */
    #getBlockHalves () {
        const BLOCK_SIZE_BITS = 64
        this.L = this.block.slice(0, BLOCK_SIZE_BITS/2)
        this.R = this.block.slice(BLOCK_SIZE_BITS/2)
        delete this.block
        this.status.push('GET_BLOCK_HALVES_L_R')
        return this
    }

    /**
     * Transforms 8 byte key to 64 bits key
     * @returns { this }
     */
    #byteKeyToBinary() {
        const KEY_SIZE_BITS = 64
        this.key = bufferToBinaryArray(this.key)
        if (this.key.length !== KEY_SIZE_BITS) {
            throw new Error('Something went wrong during the byte key to binary transforamtion')
        }
        this.status.push('|- KEYS: TRANSOFRM_BYTE_KEY_TO_BINARY')
        return this
    }

    /**
     * Select and permutate 56 bits from 64 bits key (drop parity bits) (PC-1)
     * @returns { this }
     */
    #pc1() {
        const KEY_SIZE_BITS_AFTER_PC1 = 56
        this.key = permutate(this.key, _PC1)
        if (this.key.length !== KEY_SIZE_BITS_AFTER_PC1) {
            throw new Error('Something went wrong during the PC-1')
        }
        this.status.push('|- KEYS: PC-1_KEY_BITS_PERMUTATION')
        return this
    }

    /**
     * 
     * @returns { this }
     */
    getKeyHalves() {
        const KEY_SIZE_BITS_AFTER_PC1 = 56
        this.Ci = [this.key.slice(0, KEY_SIZE_BITS_AFTER_PC1/2)]
        this.Di = [this.key.slice(KEY_SIZE_BITS_AFTER_PC1/2)]
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

    generateRoundKeys() {
        this
            .#byteKeyToBinary()
            .#pc1()
            .getKeyHalves()
            .initRoundKeys()
            .pc2()
        this.status.push('|- KEYS: DONE!')
        return this
    }

    encrypt() {
        this
            .#byteBlockToBinary()
            .#ip()
            .#getBlockHalves()
            .generateRoundKeys()
            .f()
            .fp()
            .transformBinaryBlockToBytes()
        return this
    }

    decrypt() {

    }

    static showWarnings = false
}

module.exports = DES

// static get _IP() { return _IP }

// NOTES:
// F(Ecb, Scb, Pcb, Etable, Stable, Ptable)
// FP(FPtable)
// P(Ptable)
