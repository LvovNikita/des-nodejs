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

        beforeAll(() => {
            blocksAsBinary = [
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
        })

        beforeEach(() => {
            basicCtxObj = {
                status: []
            }

            ctx = Object.assign(
                {
                    blocks: [Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x68, 0x65, 0x6c]), Buffer.from([0x6c, 0x6f, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64])]
                },
                basicCtxObj
            )
        })

        test('should return correct data as array of zeroes and ones of length 64', () => {
            assert.deepStrictEqual(blocksToBinary.call(ctx).blocks, blocksAsBinary)
        })
    })


    xdescribe('initialPermutation()', () => {
        xtest('', () => { })
    })


    xdescribe('getBlockHalves()', () => {
        xtest('', () => { })
    })


    xdescribe('roundFunction()', () => {
        xtest('', () => { })
    })


    xdescribe('finalPermutation()', () => {
        xtest('', () => { })
    })


    xdescribe('blocksToBuffer()', () => {
        xtest('', () => { })
    })

})