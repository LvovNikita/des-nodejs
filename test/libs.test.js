const assert = require('node:assert')

xdescribe('libs: keys', () => {
    xdescribe('allocateKey()', () => {
        xtest('', () => {

        })
    })

    xdescribe('generateRoundKeys()', () => {
        xtest('', () => { })
    })
})


describe('libs: data & blocks', () => {

    beforeAll(() => {
        blocksAsBinaryBeforeIP = [
            [
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                0, 1, 1, 0, 1, 0, 0, 0,
                0, 1, 1, 0, 0, 1, 0, 1,
                0, 1, 1, 0, 1, 1, 0, 0
            ],
            [
                0, 1, 1, 0, 1, 1, 0, 0,
                0, 1, 1, 0, 1, 1, 1, 1,
                0, 0, 1, 0, 0, 0, 0, 0,
                0, 1, 1, 1, 0, 1, 1, 1,
                0, 1, 1, 0, 1, 1, 1, 1,
                0, 1, 1, 1, 0, 0, 1, 0,
                0, 1, 1, 0, 1, 1, 0, 0,
                0, 1, 1, 0, 0, 1, 0, 0
            ]
        ]

        blocksAsBinaryAfterIP = [
            [
                1, 1, 1, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                1, 1, 0, 0, 0, 0, 0, 0,
                0, 1, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                1, 1, 1, 0, 0, 0, 0, 0,
                1, 0, 1, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0
            ],
            [
                1, 1, 1, 1, 1, 0, 1, 1,
                0, 0, 1, 0, 1, 0, 0, 0,
                1, 1, 0, 1, 1, 0, 1, 1,
                0, 0, 0, 1, 1, 0, 1, 0,
                0, 0, 0, 0, 0, 0, 0, 0,
                1, 1, 1, 1, 1, 1, 1, 1,
                0, 1, 0, 1, 0, 0, 1, 1,
                0, 0, 1, 1, 1, 0, 1, 0
            ]
        ]

        blocksHalves = [
            {
                L: [
                    1, 1, 1, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 0, 0, 0, 0, 0, 0,
                    0, 1, 0, 0, 0, 0, 0, 0
                ],
                R: [
                    0, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 1, 0, 0, 0, 0, 0,
                    1, 0, 1, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0
                ]
            },
            {
                L: [
                    1, 1, 1, 1, 1, 0, 1, 1,
                    0, 0, 1, 0, 1, 0, 0, 0,
                    1, 1, 0, 1, 1, 0, 1, 1,
                    0, 0, 0, 1, 1, 0, 1, 0
                ],
                R: [
                    0, 0, 0, 0, 0, 0, 0, 0,
                    1, 1, 1, 1, 1, 1, 1, 1,
                    0, 1, 0, 1, 0, 0, 1, 1,
                    0, 0, 1, 1, 1, 0, 1, 0
                ]
            }
        ]

        blockHalvesAfterSixteenRounds = [
            [
                1, 0, 1, 0, 0, 0, 1, 1,
                1, 1, 1, 1, 1, 0, 0, 1,
                1, 0, 0, 0, 1, 0, 0, 1,
                1, 1, 0, 1, 1, 0, 0, 1,
                0, 0, 1, 0, 1, 0, 0, 0,
                1, 1, 0, 1, 1, 0, 1, 1,
                0, 0, 0, 1, 1, 1, 0, 0,
                0, 0, 0, 1, 1, 0, 1, 0
            ],
            [
                1, 0, 0, 0, 0, 1, 1, 0,
                1, 1, 1, 1, 0, 0, 0, 0,
                1, 0, 0, 1, 1, 0, 1, 1,
                1, 1, 1, 1, 1, 1, 1, 0,
                1, 0, 1, 0, 1, 0, 1, 1,
                1, 0, 1, 1, 1, 1, 1, 1,
                0, 1, 1, 0, 0, 1, 1, 0,
                0, 0, 0, 1, 1, 0, 0, 0
            ]
        ]

        encryptionRoundKeys = [
            [
                0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0,
                0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0,
                0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0,
                0, 1, 0, 1
            ],
            [
                1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1,
                0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0,
                0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0,
                1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0,
                0, 0, 1, 0
            ],
            [
                0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1,
                1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0,
                0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0,
                1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0,
                1, 1, 1, 1
            ],
            [
                1, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0,
                1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1,
                1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 1,
                0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0,
                1, 0, 1, 0
            ],
            [
                0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1,
                0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
                1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1,
                0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0,
                0, 0, 1, 1
            ],
            [
                0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0,
                1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0,
                1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1,
                0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0,
                0, 0, 0, 0
            ],
            [
                1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0,
                0, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0,
                1, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1,
                1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1,
                0, 0, 0, 0
            ],
            [
                0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1,
                0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0,
                0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1,
                1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1,
                1, 0, 0, 0
            ],
            [
                1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0,
                1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1,
                0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1,
                1, 0, 0, 1
            ],
            [
                0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1,
                0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0,
                0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1,
                0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1,
                0, 0, 0, 1
            ],
            [
                0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0,
                1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0,
                0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0,
                1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1,
                0, 0, 0, 0
            ],
            [
                1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1,
                0, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1,
                0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0,
                0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1,
                0, 1, 0, 0
            ],
            [
                0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1,
                0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0,
                0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0,
                1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
                0, 1, 0, 0
            ],
            [
                0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0,
                1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0,
                1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0,
                0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0,
                1, 1, 1, 1
            ],
            [
                1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1,
                0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1,
                0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0,
                0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0,
                1, 1, 1, 1
            ],
            [
                1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
                1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1,
                1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0,
                0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0,
                0, 1, 1, 0
            ]
        ]
    })

    describe('allocateBlocks()', () => {
        const allocateBlocks = require('../lib/allocateBlocks')

        beforeAll(() => {
            dataAsString = 'hello world'
            dataAsBuffer = Buffer.from([0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64])
            dataAsBufferWithLeftPad = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x68, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64])
            dataAsBlocksWithLeftPad = [dataAsBufferWithLeftPad.subarray(0, 8), dataAsBufferWithLeftPad.subarray(8)]
        })


        beforeEach(() => {
            basicCtxObj = {
                blocks: [],
                status: []
            }

            ctx = Object.assign({ data: dataAsString }, basicCtxObj)
            bufferCtx = Object.assign({ data: dataAsBuffer }, basicCtxObj)
            wrongCtx = Object.assign({ data: null }, basicCtxObj)
        })

        test('should return correct data as Buffer for input string', () => {
            assert.deepStrictEqual(allocateBlocks.call(ctx).data, dataAsBufferWithLeftPad)
        })

        test('should return correct data as Buffer for input buffer', () => {
            assert.deepStrictEqual(allocateBlocks.call(bufferCtx).data, dataAsBufferWithLeftPad)
        })


        test('should return correct data as blocks for input string', () => {
            assert.deepStrictEqual(allocateBlocks.call(ctx).blocks, dataAsBlocksWithLeftPad)
        })

        test('should return correct data as blocks for input buffer', () => {
            assert.deepStrictEqual(allocateBlocks.call(bufferCtx).blocks, dataAsBlocksWithLeftPad)
        })

        test('should throw an error for invalid-type this.data', () => {
            assert.throws(() => allocateBlocks(wrongCtx), TypeError)
        })
    })


    describe('blocksToBinary()', () => {
        const blocksToBinary = require('../lib/blocksToBinary')

        beforeEach(() => {
            basicCtxObj = {
                status: []
            }

            ctx = Object.assign(basicCtxObj, {
                blocks: [
                    Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x68, 0x65, 0x6c]),
                    Buffer.from([0x6c, 0x6f, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64])
                ]
            })
        })

        test('should return correct data as array of zeroes and ones of length 64', () => {
            assert.deepStrictEqual(blocksToBinary.call(ctx).blocks, blocksAsBinaryBeforeIP)
        })
    })


    describe('initialPermutation()', () => {
        const initialPermutation = require('../lib/initialPermutation')

        beforeEach(() => {
            basicCtxObj = {
                status: []
            }

            ctx = Object.assign(basicCtxObj, {
                blocks: blocksAsBinaryBeforeIP
            })
        })

        test('should return correct binary blocks array after initial permutation', () => {
            assert.deepStrictEqual(initialPermutation.call(ctx).blocks, blocksAsBinaryAfterIP)
        })
    })


    describe('getBlockHalves()', () => {
        const getBlockHalves = require('../lib/getBlocksHalves')

        beforeEach(() => {
            basicCtxObj = {
                status: []
            }

            ctx = Object.assign(basicCtxObj, {
                blocks: blocksAsBinaryAfterIP
            })
        })

        test('should return correct block halves object after getting halves', () => {
            assert.deepStrictEqual(getBlockHalves.call(ctx).blocks, blocksHalves)
        })
    })


    describe('roundFunction()', () => {
        const roundFunction = require('../lib/roundFunction')

        beforeEach(() => {
            basicCtxObj = {
                status: [],
                roundKeys: encryptionRoundKeys
            }

            ctx = Object.assign(basicCtxObj, {
                blocks: blocksHalves
            })
        })

        test('should return correct block halves object after sixteen rounds of encryption', () => {
            assert.deepStrictEqual(roundFunction.call(ctx).blocks, blockHalvesAfterSixteenRounds)
        })
    })


    xdescribe('finalPermutation()', () => {
        xtest('', () => { })
    })


    xdescribe('blocksToBuffer()', () => {
        xtest('', () => { })
    })

})

// FIXME: move basicCtxObject to beforeAll