const mongoose = require('mongoose')

const tuserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unqiue: true
      },
      description: {
        type: String,
        required: true,
      },
      credits: {
        type: Number,
        required: true,
      },
      weeks: {
        type: Number,
        required: true
      }
});

module.exports = User = mongoose.model('as', tuserSchema)