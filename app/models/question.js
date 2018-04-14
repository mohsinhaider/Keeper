var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    action: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('Question', QuestionSchema);