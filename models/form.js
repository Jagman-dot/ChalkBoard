const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        role: {type: Number}
    }, {Collection: 'users'}
    )


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('UserSchema', UserSchema);