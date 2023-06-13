const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({

    title:{
        type: String,
        required: true
    },

    subtitle:{
        type: String,
        required: true
    },

    image:{
        type: String,
        required: true
    },

    label:{
        type: String,
        required: true
    },

    active:{
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('Banner', bannerSchema)