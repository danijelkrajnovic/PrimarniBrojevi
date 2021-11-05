const mongoose = require('mongoose')

const PrimesSequenceSchema = mongoose.Schema({
    numberOfPrimes: {
        type: String,
        require: true
    },
    primesSequence: {
        type: Array,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('PrimesSequences', PrimesSequenceSchema)