const DES = require('.')

// DES.showWarnings = true

DES.getBlocks('./plaintext.txt').then(blocks => {
    let encryptedBlock = new DES(blocks[0], 'ABC').encrypt()
    console.log(encryptedBlock) 
}).catch(err => {
    console.log(err.message)
})
