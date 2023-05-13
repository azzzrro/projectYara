const mongoose = require('../config/mongo')

const categorySchema = new mongoose.Schema({
 
    category: {
        type: String,
        required: true
    },

    imageUrl:{
        type: String,
        required: true
    },
    description:{
        type:String,
        required:true
    }
})


module.exports = mongoose.model('category', categorySchema )