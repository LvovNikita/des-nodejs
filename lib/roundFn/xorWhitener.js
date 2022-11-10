module.exports = function (blockR, round) {
    return blockR.
        map((bit, index) => (bit ^ this.roundKeys[round][index]))
}