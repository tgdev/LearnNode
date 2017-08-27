const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid email address'],
    required: 'Please supply an email address'
  },
  name: {
    type: String,
    trim: true,
    required: 'Please supply a name'
  }
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
userSchema.plugin(mongodbErrorHandler); // make errors pretty
// userSchema.plugin(md5);

module.exports = mongoose.model('User', userSchema);
