const mongoose = require('mongoose')

const asnameSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true
    },

  asname: {
    type: Number,
    required: true
  },

  asdate: {
    type: Date,
    required: true
  }
    
});

module.exports = User = mongoose.model('data', asnameSchema)