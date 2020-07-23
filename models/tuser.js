const mongoose = require('mongoose')

const tuserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unqiue: true
      },
      email: {
        type: String,
        required: true,
        unqiue: true
      },
      password: {
        type: String,
        required: true,
        unqiue: true
      },
      createdAt: {
        type: Date,
        default: Date.now()
      }
});

module.exports = User = mongoose.model('Tusers', tuserSchema)