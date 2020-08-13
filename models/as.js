// This is the schema for the collection as
// It collects the Acheivement Standard name, description, number of credits and number of weeks that it would take to complete/
const mongoose = require('mongoose');

const asSchema = new mongoose.Schema({
    name: {
        type: Number,
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

module.exports = User = mongoose.model('as', asSchema);