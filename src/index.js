const path = require('path')
const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const addRouter = require('./routers/add')
const cointRouter = require('./routers/coin')
const bodyParser = require('body-parser')
bodyParser.urlencoded({extended:true})

const app = express()
const port = process.env.port || 8000

// Define paths for Express config
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.use(express.json())
app.use(addRouter)
app.use(userRouter)
app.use(cointRouter)

// Setup ejs engine
app.set('view engine', 'ejs')

// Setup static directory to serve
app.use(express.static(publicDirPath))

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get('/signin', (req, res) => {
    res.render('signin')
})

app.get('/postad', (req, res) => {
    res.render('postad')
})

app.listen(port, () => {
    console.log('Server is up and running on port:', port)
})