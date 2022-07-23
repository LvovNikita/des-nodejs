module.exports = (src, pbox) => {
    const result = []
    for (let i = 0; i < pbox.length; i++) {
        result[i] = src[pbox[i]]
    }
    return result
}