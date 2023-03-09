const _E = require('../../tables/E')
const expand = require('../../utils/permutate')

module.exports = blockR => expand(blockR, _E)
    