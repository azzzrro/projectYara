const mongoose = require ('mongoose')

const brandSchema = new mongoose.Schema({

    name:{
        type: String,
        required:true
    }
})

module.exports = mongoose.model('Brands', brandSchema)