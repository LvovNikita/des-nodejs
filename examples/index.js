// const fs = require('node:fs') // для шифрования файлов
const DES = require('../index.js')

// Ключ шифрования/расшифрования:
const key = 'SECRETK'

// Создание экземпляра:
const des = new DES(key)

// Шифрование:
const plaintext = 'hello world'
des.encrypt(plaintext)
// console.log(des)
console.log(des.data)           // buffer
console.log(des.dataAsString)   // string

// Расшифрование:
const ciphertext = des.data
des.decrypt(ciphertext)
console.log(des.data)           // buffer
console.log(des.dataAsString)   // string

// process.exit(0) // comment to run lines below

// Для шифрования файлов:
// const file = fs.readFileSync('./input.txt')
// des.encrypt(file)
// fs.writeFileSync('output', des.data)

// Для расшифрования файлов:
// const file2 = fs.readFileSync('./output')
// des.decrypt(file2)
// fs.writeFileSync('output2.txt', des.data)