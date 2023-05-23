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
    },
    is_blocked:{
        type: Boolean,
        default: false
    }
})


module.exports = mongoose.model('category', categorySchema )