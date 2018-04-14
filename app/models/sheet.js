var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SheetSchema = new Schema({
    file_name: {
        type: String,
        required: true
    },
    questions: {
        type: Array,
        required: true
    }
});

module.exports = mongoose.model('Sheet', SheetSchema);