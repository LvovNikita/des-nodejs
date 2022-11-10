'use strict'

/**
 * pad left to whole number of bytes multiple eight
 */
module.exports = buffer => {
    if (!Buffer.isBuffer(buffer)) {
        throw new TypeError('buffer arg expected to be a buffer')
    }
    else if (buffer.length < 1) {
        throw new Error('buffer shouldn\'t be empty')
    }

    const SIZE = 8 // bits

    const leftPadLength = buffer.length % SIZE

    return leftPadLength === 0 
        ? buffer
        : Buffer.concat([
            Buffer.alloc(SIZE - leftPadLength, 0), 
            buffer
        ])
}


