const express = require('express')
const primesRoutes = require('./routes/primes')
const cleanerConfigRoutes = require('./routes/cleanerConfig')
const CleanerConfig = require('./models/CleanerConfig.js')
const PrimesSequence = require('./models/PrimesSequence')
const mongoose = require('mongoose')
require('dotenv/config')

const app = express()

let runIntervalMin = 0
let deleteOlderThanMin = 0
let cleanerInterval = null

const minToMilliseconds = (min) => {
    return min * 60 * 1000
}

const intervalFunc = async (deleteOlderThanMin) => {
    let dt = new Date(Date.now() - minToMilliseconds(deleteOlderThanMin))
    let result = await PrimesSequence.deleteMany({date: { '$lt': dt }})
    if(result) console.log(result)
}

//Middleware
app.use(express.json())    
app.use('/primes', primesRoutes)
app.use('/cleaner', (req, res, next) => {
    runIntervalMin = req.body.runIntervalMin
    deleteOlderThanMin = req.body.deleteOlderThanMin

    if(runIntervalMin > 0) {
        cleanerInterval = setInterval(() => intervalFunc(deleteOlderThanMin), minToMilliseconds(runIntervalMin))
        console.log('Interval function started!')
    }
    if(runIntervalMin === 0 && cleanerInterval) {
        clearInterval(cleanerInterval)
        console.log('Interval function stopped!')
    }
    if(runIntervalMin === 0 && !cleanerInterval) {
        console.log('Interval function is already stopped!')
    }
    
    next()
})
app.use('/cleaner', cleanerConfigRoutes)

mongoose.connect(process.env.DB_CONNECTION, async () => {
    console.log('Connected to DB!')
    const cleanerConfig = await CleanerConfig.find()
    if(cleanerConfig) {
        runIntervalMin = cleanerConfig[0].runIntervalMin
        deleteOlderThanMin = cleanerConfig[0].deleteOlderThanMin
        if(runIntervalMin > 0) cleanerInterval = setInterval(() => intervalFunc(deleteOlderThanMin), minToMilliseconds(runIntervalMin))
    }    
})

app.listen(3000)

