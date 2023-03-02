const binaryToBuffer = require("../../utils/binaryToBuffer")
const bufferToBinary = require("../../utils/bufferToBinary")

module.exports = blockR => {
    blockR = bufferToBinary(blockR)
    const NUM_OF_CHUNKS = 8
    const CHUNK_SIZE = 6 // bits
    let rChunks = Buffer.alloc(0)
    for (let j = 0; j < NUM_OF_CHUNKS; j++) {
        const chunkStartPos = j * CHUNK_SIZE
        const chunkEndPos = (j + 1) * CHUNK_SIZE
        const newByte = binaryToBuffer(blockR.slice(chunkStartPos, chunkEndPos))
        rChunks = Buffer.concat([rChunks, newByte])
    }
    return rChunks
}