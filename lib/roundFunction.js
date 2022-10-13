const _E = require('../tables/E')
const _S = require('../tables/S-Boxes')
const _P = require('../tables/P')

const permutate = require('../utils/permutate')
const expand = permutate

const roundFunction = function () {
    const NUM_OF_ROUNDS = 16
    for (const block of this.blocks) {
        for (let round = 0; round < NUM_OF_ROUNDS; round++ ) {
            // memoize R part
            const tempR = [...block.R] // Array<number> 32 bit
            // expand
            block.R = expand(block.R, _E) // 32 bit R -> 48 bit R
            // xor 48-bit R with 48-bit round Key
            block.R = block.R
                .map((bit, index) => (bit ^ this.roundKeys[round][index])) // Array<number> 48 bit
            // split R to 8 chunks of 6 bits
            const NUM_OF_CHUNKS = 8
            const CHUNK_SIZE = 6 // bits
            let rChunks = [] // Array<Array<number>
            for (let j = 0; j < NUM_OF_CHUNKS; j++) {
                const chunkStartPos = j * CHUNK_SIZE
                const chunkEndPos = (j + 1) * CHUNK_SIZE
                rChunks.push(block.R.slice(chunkStartPos, chunkEndPos))
            }
            // S-box: 6 bit-chunks -> 4 bit-chunks
            // (48 bit R -> 32 bit R)
            block.R = rChunks
                .map((chunk, index) => {
                    const row = chunk[0] * 2 + chunk[5] * 1
                    const column = [...chunk.slice(1, 5)]
                        .reverse()
                        .map((digit, pow) => digit * 2**pow)
                        .reduce((prev, curr) => prev + curr)
                    return Array
                        .from(_S[index][row][column].toString(2).padStart(4, '0'))
                        .map(Number)
                })
                .flat() // Array<number> 32 bits
            delete rChunks
            // P-box
            block.R = permutate(block.R, _P) // Array<number> 32 bit
            // block parts for the next round. 32-bits both:
            block.R = block.R.map((bit, index) => bit ^ block.L[index]) // R = L xor new R
            block.L = [...tempR] // L = old R
        }
    }
    // final swap!
    this.blocks = this.blocks
        .map(blockObj => [...blockObj.R, ...blockObj.L]) // Array<Array<number> 64 bit>
    return this
}

module.exports = roundFunction