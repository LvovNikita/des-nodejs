const assert = require('node:assert')

// TESTED MODULES:

const allocateKey = require('../lib/keys/allocateKey')
const generateRoundKeys = require('../lib/keys/generateRoundKeys')
const allocateBlocks = require('../lib/blocks/allocateBlocks')
const initialPermutation = require('../lib/permutations/initialPermutation')
const getBlockHalves = require('../lib/blocks/getBlocksHalves')
const expand = require('../lib/roundFn/expansion')
const xorWhitener = require('../lib/roundFn/xorWhitener')
const splitRTo6BitChunks = require('../lib/roundFn/splitRTo6BitChunks')
const sBox = require('../lib/roundFn/sBox')
const pBox = require('../lib/roundFn/pBox')
const getNewR = require('../lib/roundFn/getNewR')
const finalSwap = require('../lib/roundFn/finalSwap')
const roundFunction = require('../lib/roundFunction')
const finalPermutation = require('../lib/permutations/finalPermutation')
const joinBlocks = require('../lib/blocks/joinBlocks')

// SAMPLE DATA:

const { 
    inputKey, roundKeys, key,
    plaintext, blocks,
    blocksAfterIP,
    blocksHalves,
    blockR, blockRAfterExpansion,
    blockRAfterXORWithRoundKey0,
    blockRAfterSplitTo8Chunks,
    blockRAfterSBox,
    blockRAfterPBox,
    block, newBlockR,
    blocksBeforeFinalPermutation,
    blocksAfter16Rounds,
    blocksAfterFinalPermutation,
    outputData
} = require('./testData')

// TESTS:

describe('DES', () => {
    describe('KEYS', () => {
        describe('allocateKey()', () => {
            test('should return 64-bit key with added parity bits', () => {
                assert.deepEqual(allocateKey(inputKey), key)
            })
        })
        describe('generateRoundKeys()', () => {
            test('should generate array of 16 round keys', () => { 
                assert.deepEqual(generateRoundKeys(key), roundKeys)
            })
        })
    })


    describe('BLOCKS', () => {
        describe('allocateBlocks()', () => {
            test('should split message and pad left first block if needed', () => {
                const state = { blocks: [], status: [] }
                assert.deepEqual(allocateBlocks.call(state, plaintext).blocks, blocks)
            })
        })
        // After Initial Permutation:
        describe('getBlockHalves()', () => {
            test('should update state.blocks object with blocks halves', () => {
                const state = { blocks: blocksAfterIP, status: [] }
                assert.deepEqual(getBlockHalves.call(state).blocks, blocksHalves)
            })
        })
        // After Final Permutation:
        describe('joinBlocks()', () => {
            test('should concat blocks', () => {
                const state = { blocks: blocksAfterFinalPermutation }
                assert.deepEqual(joinBlocks.call(state).data, outputData)
            })
        })
    })


    describe('PERMUTATIONS', () => {
        // After blocks allocation:
        describe('initialPermutation()', () => {
            test('should permutate bits correctly', () => {
                const state = { blocks: blocks, status: [] }
                assert.deepEqual(initialPermutation.call(state).blocks, blocksAfterIP)
            })
        })
        // After 16 rounds
        describe('finalPermutation()', () => {
            test('should permutate bits correctly' , () => {
                const state = { blocks: blocksAfter16Rounds } 
                assert.deepEqual(finalPermutation.call(state).blocks, blocksAfterFinalPermutation)
            })
        })
    })


    describe('ROUND FUNCTION', () => {
        // Note: all tests for the first (0) round!
        describe('expansion()', () => {
            test('should expand 32 bits right part of block to 48 bits', () => {
                assert.deepEqual(expand(blockR), blockRAfterExpansion)
            })
        })
        describe('xorWhitener()', () => {
            test('should xor right part of block with corresponding round key', () => { 
                const round = 0
                const state = { roundKeys }
                assert.deepEqual(xorWhitener.call(state, blockRAfterExpansion, round), blockRAfterXORWithRoundKey0)
            })
        })
        describe('splitRTo6BitChunks()', () => {
            test('should split 48-bits right part of block to 8 6-bits chunks', () => { 
                assert.deepEqual(splitRTo6BitChunks(blockRAfterXORWithRoundKey0), blockRAfterSplitTo8Chunks)
            })
        })
        describe('sBox()', () => {
            test('should compress 48-bits right part of block to 32 bits', () => { 
                assert.deepEqual(sBox(blockRAfterSplitTo8Chunks), blockRAfterSBox)
            })
        })
        describe('pBox()', () => {
            test('should permutate bits of right part of block correctly ', () => { 
                assert.deepEqual(pBox(blockRAfterSBox), blockRAfterPBox)
            })
        })
        describe('getNewR()', () => {
            test('should return xor of original right and left blocks', () => {
                assert.deepEqual(getNewR(block), newBlockR)
            })
        })
        // Note: after 16 rounds:
        describe('finalSwap()', () => {
            test('should swap left and right parts ob block and concat them', () => { 
                const state = { blocks: blocksBeforeFinalPermutation }
                assert.deepEqual(finalSwap.call(state), blocksAfter16Rounds)
            })
        })
        describe('roundFunction()', () => {
            test('should return correct result after 16 rounds', () => {
                const state = { blocks: blocksHalves, roundKeys, status: [] }
                assert.deepEqual(roundFunction.call(state).blocks, blocksAfter16Rounds)
            })
        })
    })
})