const blocksToBuffer = function () {
    const result = []
    for (const block of this.blocks) {  // this.blocks: Array<Array<number>
        for (let i = 0; i < block.length; i += 8) {
            result.push(
                block
                    .slice(i, i + 8)
                    .reverse()
                    .map((digit, pow) => digit * 2**pow)
                    .reduce((prev, curr) => prev + curr)
                )
        }
    }
    while (result[0] === 0) result.shift()
    this.data = Buffer.from(result)
    return this
}

module.exports = blocksToBuffer