const DES = require('.')
const fs = require('node:fs')

const key = 'KEY'
const plaintext = fs.readFileSync('./plaintext.txt')

const des = new DES(key)
des.encrypt(plaintext)

// console.dir(des, { depth: Infinity })
console.log(des)
console.log(des.dataAsString)