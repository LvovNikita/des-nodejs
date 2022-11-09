const assert = require('node:assert')

describe('utils', () => {
    describe('arrayLeftShift()', () => {
        const arrayLeftShift = require('../utils/arrayLeftShift')

        beforeEach(() => {
            testArr = [1, 2, 3, 4, 5]
        })

        test('should return empty array for empty arrray input', () => {
            assert.deepStrictEqual(arrayLeftShift([]), [])
        })

        test('should return original array for zero shift', () => {
            assert.deepStrictEqual(arrayLeftShift(testArr, 0), testArr)
        })

        test('should return shifted by one array if no shift size provided', () => {
            assert.deepStrictEqual(arrayLeftShift(testArr), [2, 3, 4, 5, 1])
        })

        test('should return shifted array on given shift', () => {
            assert.deepStrictEqual(arrayLeftShift(testArr, 2), [3, 4, 5, 1, 2])
            assert.deepStrictEqual(arrayLeftShift(testArr, new Number(2)), [3, 4, 5, 1, 2])
            assert.deepStrictEqual(arrayLeftShift(testArr, testArr.length), testArr)
        })

        test('should throw an error for invalid-type arguments', () => {
            assert.throws(() => { arrayLeftShift(null, null) }, TypeError)
            assert.throws(() => { arrayLeftShift([], null) }, TypeError)
            assert.throws(() => { arrayLeftShift(null, 0) }, TypeError)
            assert.throws(() => { arrayLeftShift() }, TypeError)
        })
    })


    describe('byteToBinary()', () => {
        const byteToBinary = require('../utils/byteToBinary')

        test('should return zeroes for zero-values ', () => {
            assert.strictEqual(byteToBinary(0), '00000000')
            assert.strictEqual(byteToBinary(0x00), '00000000')
        })

        test('should return correct values', () => {
            assert.strictEqual(byteToBinary(10), '00001010')
            assert.strictEqual(byteToBinary(0x1A), '00011010')
        })

        test('should throw an error for invalid-type arguments', () => {
            assert.throws(() => byteToBinary('0'), TypeError)
            assert.throws(() => byteToBinary('A'), TypeError)
            assert.throws(() => byteToBinary(null), TypeError)
            assert.throws(() => byteToBinary(), TypeError)
        })
    })


    describe('bufferToBinary()', () => {
        const bufferToBinary = require('../utils/bufferToBinary')

        test('should return zero-array for zero buffer', () => {
            assert.deepStrictEqual(bufferToBinary(Buffer.alloc(1)), new Array(8).fill(0))
            assert.deepStrictEqual(bufferToBinary(Buffer.alloc(2)), new Array(16).fill(0))
        })

        test('should return correct arrays for buffers', () => {
            assert.deepStrictEqual(bufferToBinary(Buffer.from([1])), [0, 0, 0, 0, 0, 0, 0, 1])
            assert.deepStrictEqual(bufferToBinary(Buffer.from([0x01])), [0, 0, 0, 0, 0, 0, 0, 1])
            assert.deepStrictEqual(bufferToBinary(Buffer.from('A')), [0, 1, 0, 0, 0, 0, 0, 1])
            assert.deepStrictEqual(bufferToBinary(Buffer.from('AB')), [0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0])
        })

        test('should throw an error for empty buffer', () => {
            assert.throws(() => bufferToBinary(Buffer.alloc(0)), Error)
        })

        test('should throw an error for invalid-type arguments', () => {
            assert.throws(() => bufferToBinary(0), TypeError)
            assert.throws(() => bufferToBinary([0]), TypeError)
            assert.throws(() => bufferToBinary('0'), TypeError)
            assert.throws(() => bufferToBinary('A'), TypeError)
            assert.throws(() => bufferToBinary(null), TypeError)
            assert.throws(() => bufferToBinary(), TypeError)
        })
    })
})