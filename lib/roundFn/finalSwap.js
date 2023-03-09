module.exports = function () {
    this.blocks = this.blocks.map(block => Buffer.concat([block.R, block.L]))
    return this.blocks
}
