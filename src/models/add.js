const mongoose = require('mongoose')
const validator = require('validator')

const addSchema = mongoose.Schema({
    category: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        uppercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    room: {
        type: Number,
        default: 200,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

const Add = mongoose.model('Add', addSchema)

module.exports = Add