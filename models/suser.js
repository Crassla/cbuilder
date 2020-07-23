const mongoose = require('mongoose')

const suserSchema = mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      unique: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  });
  
  

module.exports = User = mongoose.model('users', suserSchema)