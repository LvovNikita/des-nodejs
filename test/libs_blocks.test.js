const assert = require('node:assert')


describe('libs: data & blocks', () => {
    beforeAll(() => {
        ({
            blocksAsBinaryBeforeIP, 
            blocksAsBinaryAfterIP, 
            blocksHalves, 
            blockHalvesAfterSixteenRounds, 
            blocksAfterFinalPermutation, 
            blocksAsBuffer, 
            encryptionRoundKeys
        } = require('./testData'))
    })


    beforeEach(() => {
        basicCtxObj = {
            status: [],
        }
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


    describe('finalPermutation()', () => {
        const finalPermutation = require('../lib/finalPermutation')

        beforeEach(() => {
            ctx = Object.assign(basicCtxObj, {
                blocks: blockHalvesAfterSixteenRounds
            })
        })

        test('should return correct binary blocks after final permutation', () => {
            assert.deepStrictEqual(finalPermutation.call(ctx).blocks, blocksAfterFinalPermutation)
        })
    })


    describe('blocksToBuffer()', () => {
        const blocksToBuffer = require('../lib/blocksToBuffer')

        beforeEach(() => {
            ctx = Object.assign(basicCtxObj, {
                blocks: blocksAfterFinalPermutation
            })
        })

        test('1', () => {
            assert.deepStrictEqual(blocksToBuffer.call(ctx).data, blocksAsBuffer)
        })
    })
})