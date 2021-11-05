const express = require('express')
const PrimesSequence = require('../models/PrimesSequence')

const router = express.Router()

const calculatePrimesSequence = (numberOfPrimes) => {
    let counter = 0
    let currentNumber = 2
    let primesSequence = []

    const isPrime = (number, currentDivisor) => {
        if(number === currentDivisor) return true
        if(number % currentDivisor === 0) return false
        return isPrime(number, currentDivisor + 1)        
    }

    while(counter < numberOfPrimes) {
        if(isPrime(currentNumber, 2)) {
            primesSequence.push(currentNumber)
            counter++
        }
        currentNumber++
    }

    return primesSequence
}

const primesSequenceInDB = async (numberOfPrimes) => {
    try {
        const resultFind = await PrimesSequence.findOne({ numberOfPrimes: numberOfPrimes })
        if (resultFind) await PrimesSequence.updateOne({ _id: resultFind._id }, { $set: {date: Date.now()} })
        const resultUpdateFind = await PrimesSequence.findOne({ numberOfPrimes: numberOfPrimes })
        return resultUpdateFind        
    } catch(error) {        
        return { message: error }
    }
}

router.get('/:n', async (req, res) => {
    const result = await primesSequenceInDB(req.params.n)
    if(result) {
        res.json(result)
        return
    }    
    
    let primesSequence = calculatePrimesSequence(req.params.n)        
    
    const primesSequenceForSave = new PrimesSequence({
        numberOfPrimes: req.params.n,
        primesSequence: primesSequence
    })

    try {
        const savedPrimesSequence =  await primesSequenceForSave.save()
        res.json({
            code: '200',
            message: 'Primes saved successfully!',            
            object: savedPrimesSequence
        })
    } catch(error) {        
        res.json({
            code: '500',
            message: 'Server error while saving primes!',
            object: error
        })
    }
})

router.post('/clean', async (req, res) => {
    try {
        const result = await PrimesSequence.deleteMany({})
        res.json({
            code: '200',
            message: 'All documents from DB are deleted!',
            object: result
        })
    } catch(error) {
        res.json({
            code: '500',
            message: 'Server error while deleting all documents from DB!',
            object: error
        })
    }
})

module.exports = router