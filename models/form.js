const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Signup = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    role: Number
    });




module.exports = mongoose.model('User', Signup);