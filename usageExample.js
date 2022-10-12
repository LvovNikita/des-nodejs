const DES = require('.')
const fs = require('node:fs')

const key = 'SECRETK' // 56-bit key
const plaintext = fs.readFileSync('./plaintext.txt')
const cipherext = Buffer.from([0x2a, 0x08, 0xaa, 0x88, 0x80, 0x16, 0x3a, 0x14, 0x94, 0xb7, 0x32, 0x3b, 0x37, 0xb9, 0x1c, 0x92])
// console.log(cipherext)

const des = new DES(key)

// des.encrypt(plaintext)
des.encrypt('hello world')
console.log('CIPHERTEXT: ' + des.dataAsString) // string
console.log(des.data) // buffer

// des.decrypt(cipherext)
// console.log(des)
// console.log(des.dataAsString)