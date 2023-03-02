const isNumber = require('./isNumber')

module.exports = (arr, shiftBitSize = 1) => {
    if (!Array.isArray(arr)) {
        throw new TypeError('first arg expected to be an array')
    }
    if (!isNumber(shiftBitSize)) {
        throw new TypeError('second arg expected to be a number')
    }
    
    return [...arr.slice(shiftBitSize), ...arr.slice(0, shiftBitSize)]
}