module.exports = function (blockR, round) {
    return blockR.
        map((byte, index) => (byte ^ this.roundKeys[round][index]))
}