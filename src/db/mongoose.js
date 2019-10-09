const mongoose = require('mongoose')

const connectionURL = 'mongodb://127.0.0.1:27017/hackit-api'

mongoose.connect(connectionURL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})