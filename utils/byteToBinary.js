const isNumber = require('./isNumber')

module.exports = byte => { 
    if (!isNumber(byte)) {
        throw new TypeError('byte arg expected to be a number')
    }

    return byte.toString(2).padStart(8, 0) // String
} 

