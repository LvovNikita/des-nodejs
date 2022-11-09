module.exports = (arr, shiftBitSize = 1) => {
    if (!Array.isArray(arr)) {
        throw new TypeError('first arg expected to be an array')
    }
    if (Object.prototype.toString.call(shiftBitSize) !== '[object Number]') {
        throw new TypeError('second arg expected to be a number')
    }
    return [...arr.slice(shiftBitSize), ...arr.slice(0, shiftBitSize)]
}