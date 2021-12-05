const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const SignupSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: {
        type: String,
        required: true
    },
    role: Number
    });

SignupSchema.plugin(passportLocalMongoose);




module.exports = mongoose.model('user', SignupSchema);