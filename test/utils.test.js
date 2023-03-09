const assert = require('node:assert')

// TESTED MODULES:

const isNumber = require('../utils/isNumber')
const arrayLeftShift = require('../utils/arrayLeftShift')
const byteToBinary = require('../utils/byteToBinary')
const bufferToBinary = require('../utils/bufferToBinary')
const getParityBit = require('../utils/getParityBit')
const permutate = require('../utils/permutate')
// TODO: binaryToBuffer

// TESTS:

describe('UTILS', () => {
    describe('isNumber()', () => {
        test('should return true for integers', () => {
            assert.ok(isNumber(-255))
            assert.ok(isNumber(-1))
            assert.ok(isNumber(0))
            assert.ok(isNumber(1))
            assert.ok(isNumber(255))
        })
        test('should return true for floats', () => {
            assert.ok(isNumber(-255.1))
            assert.ok(isNumber(-1.1))
            assert.ok(isNumber(0.1))
            assert.ok(isNumber(1.1))
            assert.ok(isNumber(255.1))
        })
        test('should return true for number objects', () => {
            assert.ok(isNumber(new Number(-255)))
            assert.ok(isNumber(new Number(-1)))
            assert.ok(isNumber(new Number(0)))
            assert.ok(isNumber(new Number(1)))
            assert.ok(isNumber(new Number(255)))
        })
    })


    describe('arrayLeftShift()', () => {
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


    describe('getParityBit()', () => {
        test('should return parity bit so number of ones becomes even', () => {
            assert.strictEqual(getParityBit([0]), 0)
            assert.strictEqual(getParityBit([1]), 1)
            assert.strictEqual(getParityBit([0, 0]), 0)
            assert.strictEqual(getParityBit([0, 1]), 1)
            assert.strictEqual(getParityBit([1, 0]), 1)
            assert.strictEqual(getParityBit([1, 1]), 0)
            assert.strictEqual(getParityBit([1, 0, 0]), 1)
            assert.strictEqual(getParityBit([1, 0, 1]), 0)
            assert.strictEqual(getParityBit([1, 1, 0]), 0)
            assert.strictEqual(getParityBit([1, 1, 1]), 1)
        })
        test('should throw an error for empty array', () => {
            assert.throws(() => getParityBit([]), Error)
        })
        test('should throw an for arrays that contain something except zeroes and ones as numbers', () => {
            assert.throws(() => getParityBit([0, 1, 2]), Error)
        })
        test('should throw an error for invalid-type arguments', () => {
            assert.throws(() => getParityBit(), TypeError)
            assert.throws(() => getParityBit(null), TypeError)
        })
    })


    describe('permutate()', () => {
        beforeEach(() => {
            testArr = Buffer.from([10])
            testPBox = [0, 1, 2, 4, 5, 6, 7, 0]
            testEBox = [0, 1, 2, 3, 4, 5, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0]
        })
        test('should permutate and expand correctly', () => {
            assert.deepEqual(permutate(testArr, testPBox), Buffer.from([20]))
            assert.deepEqual(permutate(testArr, testEBox), Buffer.from([10, 0]))
        })
        test('should throw an error for invalid-type arguments', () => {
            assert.throws(() => permutate(), TypeError)
            assert.throws(() => permutate(null), TypeError)
            assert.throws(() => permutate(null, testPBox), TypeError)
            assert.throws(() => permutate(testArr, null), TypeError)
            assert.throws(() => permutate(null, null), TypeError)
        })
    })
})