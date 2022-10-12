const DES = require('.')
const fs = require('node:fs')

// DES.showWarnings = true

// DES.getBlocks('./plaintext.txt').then(blocks => {
//     let encryptedBlock = new DES(blocks[0], 'KEY').encrypt()
//     // console.dir(encryptedBlock, { depth: 3 })
//     encryptedBlock.decrypt() 
// }).catch(err => {
//     console.log(err.message)
// })

const key = 'KEY'
const plaintext = fs.readFileSync('./plaintext.txt')

const des = new DES(key)
des.encrypt(plaintext)

// console.dir(des, { depth: Infinity })
console.log(des)
console.log(des.dataAsString)