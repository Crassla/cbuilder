// This is the schema for the collection data
// It collects the name of the student and the asname and date it is due. 
const mongoose = require('mongoose');

const asnameSchema = new mongoose.Schema({
  year_level:{

  },

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

module.exports = User = mongoose.model('data', asnameSchema);