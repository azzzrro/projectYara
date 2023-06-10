const mongoose = require('mongoose')

const subCategorySchema = new mongoose.Schema({

    subCategory:{
        type: String,
        required: true
    },

    imageUrl:{
        type: String,
        required: true
    },

    description:{
        type: String,
        required: true
    },

    is_blocked:{
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('SubCategory', subCategorySchema)