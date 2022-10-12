const blocksToBuffer = function () {
    this.data = Buffer.alloc(0)
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
        this.data = Buffer.concat([this.data, Buffer.from(result)]) // buffer
    }
    return this
}

module.exports = blocksToBuffer