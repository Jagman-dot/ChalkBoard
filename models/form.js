const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const SignupSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: Number
    });

SignupSchema.plugin(passportLocalMongoose);




module.exports = mongoose.model('user', SignupSchema);