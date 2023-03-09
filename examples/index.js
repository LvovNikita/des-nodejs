const fs = require('node:fs')
const DES = require('../index.js')

// Key:
const key = 'SECRETK'

// DES instance:
const des = new DES(key)

// Encryption:
const plaintext = 'hello world'
des.encrypt(plaintext)
console.log(des.data)           // buffer
console.log(des.dataAsString)   // string

// Decryption:
const ciphertext = des.data
des.decrypt(ciphertext)
console.log(des.data)           // buffer
console.log(des.dataAsString)   // string

process.exit(0) // Comment to run lines below

// Fils encryption:
const file = fs.readFileSync('./input.txt')
des.encrypt(file)
fs.writeFileSync('output', des.data)

// File decryption:
const file2 = fs.readFileSync('./output')
des.decrypt(file2)
fs.writeFileSync('output2.txt', des.data)