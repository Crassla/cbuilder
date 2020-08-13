//This collects the username password and email of the students which are used to login
//The email data can later be used to have an automatic response when succesfully added 
const mongoose = require('mongoose');

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
  
  

module.exports = User = mongoose.model('users', suserSchema);