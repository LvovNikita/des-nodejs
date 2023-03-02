const _S = require('../../tables/S-Boxes')

module.exports = rBlock => {
    const resultBuff = Buffer.alloc(4)
    // rChunks = chunksAsArrayToBuffer(rChunks)
    for (let i = 0; i < rBlock.length; i++) {
        const chunk = rBlock[i]
        const row = getSBoxRow(chunk)
        const column = (chunk & 0b011110) >> 1
        const sboxValue = Buffer.from([_S[i][row][column]])[0]
        const shift = i % 2 === 0 ? 4 : 0
        resultBuff[~~(i/2)] |= sboxValue << shift
    }
    return resultBuff
}

const rowsMap = new Map([[0, 0], [1, 1], [32, 2], [33, 3]])
function getSBoxRow(chunk) {
    return rowsMap.get(chunk & 0b100001)
}
