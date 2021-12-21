const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const CourseSchema = new mongoose.Schema(
    {
        courseName1: {type: String, required: true},
        rosterSize1: {type: String, required: true},
        addProfessor1: {type: String},
        endDate1: {type: Date, required: true}
    }, {Collection: 'courses'}
)


CourseSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('CourseSchema', CourseSchema);