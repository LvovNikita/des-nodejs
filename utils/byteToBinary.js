// TODO: return buffer instead

module.exports = byte => { 
    if (Object.prototype.toString.call(byte) !== '[object Number]') {
        throw new TypeError('byte arg expected to be a number')
    }
    return byte.toString(2).padStart(8, 0)
} 

