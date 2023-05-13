const mongoose = require('../config/mongo');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required:true
    },
    email: {
      type: String,
      required:true
    },
    mobile: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    is_blocked: {
      type: Boolean,
      required: true
    }
  });
  
  module.exports = mongoose.model("User", userSchema);