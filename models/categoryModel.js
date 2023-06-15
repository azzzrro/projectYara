const mongoose = require('../config/mongo')

const categorySchema = new mongoose.Schema({
 
    category: {
        type: String,
        required: true
    },

    imageUrl:{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required:true
        }
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