const byteToBinary = byte => byte.toString(2).padStart(8, 0)

module.exports = buffer => Array
    .from(buffer)
    .map(byte => byteToBinary(byte))
    .reduce((prev, curr) => prev + curr)
    .split('')
    .map(Number)