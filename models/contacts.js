const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    mobile: {
        type: Number,
        required: true,
        min: 999999999,
        max: 9999999999,
        unique: true
    },
    name: {
        type: String,
        require: true,
        maxLength: 50
    },
    address: {
        type: String,
        required: true
    }
})

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;