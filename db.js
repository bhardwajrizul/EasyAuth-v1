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
  },
  resetPass: {
    type: String,
    default: null
  },
  resetPassExpires: {
    type: Date,
    default: null
  },
  timesPassUpdated: {
    type: Number,
    default: 0
  }

});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
