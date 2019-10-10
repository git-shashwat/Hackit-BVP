const path = require('path')
const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const addRouter = require('./routers/add')
const cointRouter = require('./routers/coin')
const Add = require('./models/add')
const hbs = require('hbs')

const app = express()
const port = process.env.port || 8000

// Define paths for Express config
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.use(express.json())
app.use(userRouter)
app.use(addRouter)
app.use(cointRouter)

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirPath))

app.get('/', async (req, res) => {
    try {
        const adds = await Add.find({})
        res.send(adds)
    } catch (e) {
        res.status(500).send(e)
    }
})

app.listen(port, () => {
    console.log('Server is up and running on port:', port)
})