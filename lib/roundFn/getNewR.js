module.exports = block => block.R
    .map((bit, index) => bit ^ block.L[index])