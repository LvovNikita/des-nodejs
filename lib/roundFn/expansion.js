const _E = require('../../tables/E')
const expand = require('../../utils/permutate')

module.exports = block => expand(block.R, _E)