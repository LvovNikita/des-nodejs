const DES = require('.')

DES.showWarnings = true

DES.getBlocks('./plaintext.txt').then(blocks => {
    console.log(blocks[0])
    let encryptedBlock = new DES(blocks[0], 'KEY').encrypt()
    console.dir(encryptedBlock, { depth: 3 }) 
}).catch(err => {
    console.log(err.message)
})