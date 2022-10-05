const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "Password is required!"]
  },
  passwordConfirm: {
    type: String
  },
  name: {
    type: String,
    required: [true, "Name is required!"]
  }
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
