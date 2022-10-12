const blocksToBuffer = function () {
    for (const block of this.blocks) {  // this.blocks: Array<Array<number>
        const result = []
        for (let i = 0; i < block.length; i += 8) {
            result.push(
                block
                    .slice(i, i + 8)
                    .reverse()
                    .map((digit, pow) => digit * 2**pow)
                    .reduce((prev, curr) => prev + curr)
                )
        }
        this.output = Buffer.concat([this.output, Buffer.from(result)]) // buffer
    }
    return this
}

module.exports = blocksToBuffer