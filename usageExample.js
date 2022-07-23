const DES = require('.')

DES.showWarnings = true

DES.getBlocks('./plaintext.txt').then(blocks => {
    let encryptedBlock = new DES(blocks[0], 'ABCABCAB').encrypt()
    console.dir(encryptedBlock, { depth: 3 }) 
}).catch(err => {
    console.log(err.message)
})