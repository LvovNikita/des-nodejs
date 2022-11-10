module.exports = function () {
    this.blocks = this.blocks.map(block => [...block.R, ...block.L])
}
