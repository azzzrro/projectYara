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

    subCategory:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true
    },

    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },

    imageUrl:[{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required:true
        }
    }],
    
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
    },

    offerlabel:{
        type: Array,
        default: []
    },

    oldPrice:{
        type: Number,
        default: 0
    }

})


module.exports = mongoose.model('Product', produtSchema)