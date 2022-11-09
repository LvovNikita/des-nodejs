const byteToBinary = require('./byteToBinary') 

// TODO: use buffers and Uint8Arrays instead!

module.exports = buffer => {
    if (!Buffer.isBuffer(buffer)) throw new TypeError('arg expected to be a buffer') 
    if (buffer.length < 1) throw new Error('buffer shouldn\'t be empty')
    
    return Array
        .from(buffer)
        .map(byte => byteToBinary(byte))
        .reduce((prev, curr) => prev + curr)
        .split('')
        .map(Number)
}