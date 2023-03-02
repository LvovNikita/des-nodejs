module.exports = function(binArr, byteLength = 8) {
    const result = []
    while (binArr.length) {
        result.push(binArr.splice(0, byteLength))
    }
    return Buffer.from(
        result.map(arr => {
            return parseInt(arr.join(''), 2) 
        })
    )
}