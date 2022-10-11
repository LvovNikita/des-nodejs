/**
 * @returns {0|1}
 */

const getParityBit = array => array.reduce((prev, curr) => prev ^ curr)

module.exports = getParityBit