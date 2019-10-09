const log = console.log

const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const addRouter = require('./routers/add')

const app = express()
const port = process.env.port || 3000

app.use(express.json())
app.use(userRouter)
app.use(addRouter)

app.listen(port, () => {
    log('Server is up and running on port:', port)
})