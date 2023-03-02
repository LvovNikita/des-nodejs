module.exports = array => {
    if (!Array.isArray(array)) {
        throw new TypeError('array arg expected to be an array')
    }
    else if (array.lengh < 1) {
        throw new Error('array shouldn\'t be empty')
    }
    else if (!array.every(bit => [0, 1].includes(bit))) {
        throw new Error('array should contains only zeroes and ones')
    }
    
    return array.reduce((prev, curr) => prev ^ curr) // 0 / 1
}
