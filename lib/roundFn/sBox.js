const _S = require('../../tables/S-Boxes')

module.exports = rChunks => {
    const resultBuff = Buffer.alloc(4)
    rChunks = chunksAsArrayToBuffer(rChunks)
    for (let i = 0; i < rChunks.length; i++) {
        const chunk = rChunks[i]
        const row = getSBoxRow(chunk)
        const column = getSBoxCol(chunk)
        const sboxValue = Buffer.from([_S[i][row][column]])[0]
        const shift = i % 2 === 0 ? 4 : 0
        resultBuff[~~(i/2)] |= sboxValue << shift
    }
    // TODO: return just resultBuff
    return resultBuff.readUInt32BE().toString(2).split('').map(Number)
}

// TODO: module
function chunksAsArrayToBuffer(chunksOriginal) {
    let chunks = Array.from(chunksOriginal)
    chunks = chunks.map(chunk => parseInt(chunk.join(''), 2))
    return Buffer.from(chunks)
}

const rowMask = new Buffer.from([0x21])[0]
const rowsMap = new Map([[0, 0], [1, 1], [32, 2], [33, 3]])
function getSBoxRow(chunk) {
    return rowsMap.get(chunk & rowMask)
}

const columnMask = new Buffer.from([0x1E])[0]
function getSBoxCol(chunk) {
    return (chunk & columnMask) >> 1
}