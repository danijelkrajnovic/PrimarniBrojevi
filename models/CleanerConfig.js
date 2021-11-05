const mongoose = require('mongoose')

const CleanerConfigSchema = mongoose.Schema({
    runIntervalMin: {
        type: Number,
        require: true
    },
    deleteOlderThanMin: {
        type: Number,
        require: true
    }
})

module.exports = mongoose.model('CleanerConfig', CleanerConfigSchema)