const joinBlocks = function () {
    this.data = Buffer.concat([...this.blocks])
    return this
}

module.exports = joinBlocks