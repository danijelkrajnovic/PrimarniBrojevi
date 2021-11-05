const express = require('express')
const CleanerConfig = require('../models/CleanerConfig.js')

const router = express.Router()

router.post('/', async (req, res) => {
    const cleanerConfigObject = {
        runIntervalMin: req.body.runIntervalMin,
        deleteOlderThanMin: req.body.deleteOlderThanMin
    }

    const cleanerConfig = new CleanerConfig(cleanerConfigObject)

    let configDocument = []
    try {
        configDocument = await CleanerConfig.find()
    } catch(error) {
        res.json({
            code: '500',
            message: 'Error while retrieving cleaner config from DB!',
            object: error
        })
    }    

    if(configDocument.length === 0) {
        try {
            const savedCleanerConfig = await cleanerConfig.save()
            res.json({
                code: '200',
                message: 'Cleaner config saved successfully!',
                object: savedCleanerConfig
            })
        } catch (error) {
            res.json({
                code: '500',
                message: 'Server error while saving cleaner config to DB!',
                object: error
            })
        }
    }

    if(configDocument.length > 0) {
        try {
            const updatedCleanerConfig = await CleanerConfig.updateOne({ _id: configDocument[0]._id }, { $set: cleanerConfigObject })
            res.json({
                code: '200',
                message: 'Cleaner config updated successfully!',
                object: updatedCleanerConfig
            })
        } catch (error) {
            res.json({
                code: '500',
                message: 'Server error while updating cleaner config in DB!',
                object: error
            })
        }
    }    
})

module.exports = router