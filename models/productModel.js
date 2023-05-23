const mongoose = require('../config/mongo')


const produtSchema = new mongoose.Schema({
 
    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },

    imageUrl: {
        type: Array,
        required: true
    },
    
    stock:{
        type:Number,
        required:true
    },

    isOnCart:{
        type:Boolean,
        default:false
    },

    isWishlisted:{
        type:Boolean,
        default:false
    }

})


module.exports = mongoose.model('Product', produtSchema)