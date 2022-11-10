const _S = require('../../tables/S-Boxes')

module.exports = rChunks => {
    return rChunks
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
}