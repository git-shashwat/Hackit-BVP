const mongoose = require('mongoose')

const coinSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        max: 100
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
})

coinSchema.methods.toJSON = function () {
    const coin = this
    const coinObject = coin.toObject()

    delete coinObject.owner
    return coinObject
}

const Coin = mongoose.model('Coin', coinSchema)

module.exports = Coin