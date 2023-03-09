// KEYS:

exports.inputKey = 'SECRETK'

exports.key = Buffer.from([83, 163, 80, 106, 36, 43, 80, 150])

exports.roundKeys = [
    Buffer.from([17, 198, 6, 6, 19, 229]),
    Buffer.from([244, 46, 72, 108, 96, 130]),
    Buffer.from([66, 246, 32, 100, 96, 79]),
    Buffer.from([200, 157, 86, 166, 144, 202]),
    Buffer.from([100, 226, 75, 132, 151, 99]),
    Buffer.from([35, 213, 34, 30, 142, 96]),
    Buffer.from([232, 9, 211, 88, 205, 80]),
    Buffer.from([53, 226, 25, 9, 228, 24,]),
    Buffer.from([172, 89, 204, 128, 30, 249]),
    Buffer.from([18, 99, 73, 27, 154, 49]),
    Buffer.from([9, 93, 49, 19, 77, 48,]),
    Buffer.from([197, 41, 205, 9, 41, 20]),
    Buffer.from([19, 230, 129, 225, 96, 148]),
    Buffer.from([89, 29, 162, 97, 2, 143,]),
    Buffer.from([240, 160, 205, 150, 16, 143]),
    Buffer.from([136, 60, 182, 57, 37, 6]),
]

// BLOCKS:

exports.plaintext = 'hello world'

exports.blocks = [
    Buffer.from([0, 0, 0, 0, 0, 104, 101, 108]), 
    Buffer.from([108, 111, 32, 119, 111, 114, 108, 100])
]

exports.blocksAfterIP = [
    Buffer.from([224, 0, 192, 64, 0, 224, 160, 0]), 
    Buffer.from([251, 40, 219, 26, 0, 255, 83, 58])
]

exports.blocksHalves = [
    {
        L: Buffer.from([224, 0, 192, 64]), 
        R: Buffer.from([0, 224, 160, 0])
    }, 
    {
        L: Buffer.from([251, 40, 219, 26]),
        R: Buffer.from([0, 255, 83, 58])
    }
]

// ROUND FUNCTION:
// Note: data for the first (0) round

exports.blockR = this.blocksHalves[0].R

exports.blockRAfterExpansion = Buffer.from([0, 23, 1, 80, 0, 0])

exports.blockRAfterXORWithRoundKey0 = Buffer.from([17, 209, 7, 86, 19, 229])

exports.blockRAfterSplitTo8Chunks = Buffer.from([4, 29, 4, 7, 21, 33, 15, 37])

exports.blockRAfterSBox = Buffer.from([219, 149, 244, 174])

exports.blockRAfterPBox = Buffer.from([237, 142, 213, 171])

exports.block = this.blocksHalves[0]

exports.newBlockR = Buffer.from([224, 224, 96, 64])

exports.blocksBeforeFinalPermutation = [
    {
        L: Buffer.from([40, 219, 28, 26]),
        R: Buffer.from([163, 249, 137, 217])
    },
    {
        L: Buffer.from([171, 191, 102, 24]),
        R: Buffer.from([134, 240, 155, 254])
    }
]

exports.blocksAfter16Rounds = [
    Buffer.from([163, 249, 137, 217, 40, 219, 28, 26]), 
    Buffer.from([134, 240, 155, 254, 171, 191, 102, 24])
]

// FINAL PERMUTATIONS

exports.blocksAfterFinalPermutation = [
    Buffer.from([117, 98, 8, 191, 59, 208, 49, 117]),
    Buffer.from([164, 237, 105, 167, 55, 185, 25, 245])
]

// OUTPUT

exports.outputData = Buffer
    .from([117, 98, 8, 191, 59, 208, 49, 117, 164, 237, 105, 167, 55, 185, 25, 245])