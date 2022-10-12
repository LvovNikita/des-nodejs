const DES = require('.')
const fs = require('node:fs')

const key = 'SECRETK' // 56-bit key
const plaintext = fs.readFileSync('./plaintext.txt')

const des = new DES(key)
const des2 = new DES(key)

des.encrypt(plaintext)
const ciphertext = des.data
console.log('ENCRYPTION:')
console.log(des.data) // buffer
console.log(des.dataAsString)
// console.log(des.roundKeys)

console.log('DECRYPTION:')
des2.decrypt(ciphertext)
console.log(des2.data)
console.log(des2.dataAsString)
// console.log(des2.roundKeys)