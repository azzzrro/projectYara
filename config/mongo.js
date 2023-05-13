const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.MONGO_URL);

module.exports = mongoose;
