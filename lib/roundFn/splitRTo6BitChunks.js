module.exports = blockR => {
    const NUM_OF_CHUNKS = 8
    const CHUNK_SIZE = 6 // bits
    let rChunks = [] // Array<Array<number>
    for (let j = 0; j < NUM_OF_CHUNKS; j++) {
        const chunkStartPos = j * CHUNK_SIZE
        const chunkEndPos = (j + 1) * CHUNK_SIZE
        rChunks.push(blockR.slice(chunkStartPos, chunkEndPos))
    }
    return rChunks
}