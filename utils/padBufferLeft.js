const size = 8 // bits

/**
 * pad left to whole number of bytes
 */
module.exports = buffer => buffer.length % size !== 0 
    ? Buffer.concat([Buffer.alloc(size - buffer.length % size, 0), buffer])
    : buffer


