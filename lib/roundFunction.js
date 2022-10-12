const _E = require('../tables/E')
const _S = require('../tables/S-Boxes')
const _P = require('../tables/P')

const permutate = require('../utils/permutate')
const expand = permutate

const roundFunction = function (decription = false) {
    // const NUM_OF_ROUNDS = 16
    const NUM_OF_ROUNDS = 1 // FIXME: for testing purposes only
    if (decription) {
        this.roundKeys.reverse()
    }
    for (const block of this.blocks) {
        for (let round = 0; round < NUM_OF_ROUNDS; round++ ) {
            // TODO: memoize R part
            const tempR = [...block.R]
            // expand
            block.R = expand(block.R, _E) // 32 bit R -> 48 bit R
            // xor 48-bit R with 48-bit round Key
            block.R = block.R
                .map((bit, index) => (bit ^ this.roundKeys[round][index]))
            // split R to 8 chunks of 6 bits
            const NUM_OF_CHUNKS = 8
            const CHUNK_SIZE = 6 // bits
            let rChunks = []
            for (let j = 0; j < NUM_OF_CHUNKS; j++) {
                const chunkStartPos = j * CHUNK_SIZE
                const chunkEndPos = (j + 1) * CHUNK_SIZE
                rChunks.push(block.R.slice(chunkStartPos, chunkEndPos))
            }
            // S-box: 6 bit-chunks -> 4 bit-chunks then
            block.R = rChunks
                .map((chunk, index) => {
                    const row = chunk[0] * 1 + chunk[5] * 1
                    const column = [...chunk.slice(1, 5)]
                        .reverse()
                        .map((digit, pow) => digit * 2**pow)
                        .reduce((prev, curr) => prev + curr)
                    return Array
                        .from(_S[index][row][column].toString(2).padStart(4, '0'))
                        .map(Number)
                })
                .flat() // Array<number> 32 bits
            // P-box
            block.R = permutate(block.R, _P)
            // block parts for the next round:
            block.R = block.R.map((bit, index) => bit ^ block.L[index]) // R = L xor new R
            block.L = tempR                                             // L = old R
        }
    }
    this.blocks = this.blocks
        .map(blockObj => [...blockObj.L, ...blockObj.R])
    return this
}

module.exports = roundFunction