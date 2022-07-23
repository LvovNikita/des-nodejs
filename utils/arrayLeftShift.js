module.exports = (arr, shiftAmountOfBits) => [
    ...arr.slice(shiftAmountOfBits),
    ...arr.slice(0, shiftAmountOfBits)
]