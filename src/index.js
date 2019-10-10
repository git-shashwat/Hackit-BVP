const path = require('path')
const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const addRouter = require('./routers/add')
const cointRouter = require('./routers/coin')
const Add = require('./models/add')
const multer = require('multer')

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

// Setup handlebars engine
app.set('view engine', 'ejs')

// Setup static directory to serve
app.use(express.static(publicDirPath))

// Add Image Upload Section if necessary

app.get('/', async (req, res) => {
    try {
        const adds = await Add.find({})
        if (!adds) {
            return res.render({message:'No adds Available'})
        }
        res.render('index', { adds: adds })
    } catch (e) {
        res.status(500).send(e)
    }
})

app.listen(port, () => {
    console.log('Server is up and running on port:', port)
})