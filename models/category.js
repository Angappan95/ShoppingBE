const mongoose = require("mongoose");

const CategorySchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 96,
        unique: true
    },
    description: {
        type: String,
        maxlength: 256
    }
}, {
    timestamp: true
}
)

module.exports = mongoose.model('Category', CategorySchema) 