const DES = require('.')

DES.showWarnings = true

DES.getBlocks('./plaintext.txt').then(blocks => {
    let encryptedBlock = new DES(blocks[0], 'KEY').encrypt()
    // console.dir(encryptedBlock, { depth: 3 })
    encryptedBlock.decrypt() 
}).catch(err => {
    console.log(err.message)
})
