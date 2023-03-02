const byteToBinary = require('./byteToBinary')

// TODO: use buffers instead!

module.exports = buffer => {
    if (!Buffer.isBuffer(buffer)) {
        throw new TypeError('arg expected to be a buffer') 
    }
    else if (buffer.length < 1) {
        throw new Error('buffer shouldn\'t be empty')
    } 
    
    return Array
        .from(buffer)
        .map(byte => byteToBinary(byte))
        .reduce((prev, curr) => prev + curr)
        .split('')
        .map(Number) // Array[Number]
}