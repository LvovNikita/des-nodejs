module.exports = (arr, shiftBitSize) => [
    ...arr.slice(shiftBitSize),
    ...arr.slice(0, shiftBitSize)
]