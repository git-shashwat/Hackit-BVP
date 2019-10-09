const path = require('path')
const http = require('http')
const express=require('express');
var reload = require('reload');

const app=express();
const port=process.env.PORT||3000;
const ejs=require("ejs");
const server = http.createServer(app)
const Filter = require('bad-words')
const bodyParser=require("body-parser");
const socketio = require('socket.io')
const io = socketio(server)
const { generateMessage, generateLocationMessage } = require('./src/utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./src/utils/users')

app.use(express.static("public"))

app.use(bodyParser.urlencoded({extended:true}))

app.set("view engine","ejs")




app.get("/",(req,res)=>{
  res.render("home");
  console.log(req.query);
})



  io.on('connection', (socket) => {
      console.log('New WebSocket connection')

      socket.on('join', (options, callback) => {
          const { error, user } = addUser({ id: socket.id, ...options })

          if (error) {
              return callback(error)
          }

          socket.join(user.room)

          socket.emit('message', generateMessage('Admin', 'Welcome!'))
          socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
          io.to(user.room).emit('roomData', {
              room: user.room,
              users: getUsersInRoom(user.room)
          })

          callback()
      })

      socket.on('sendMessage', (message, callback) => {
          const user = getUser(socket.id)
          const filter = new Filter()

          if (filter.isProfane(message)) {
              return callback('Profanity is not allowed!')
          }

          io.to(user.room).emit('message', generateMessage(user.username, message))
          callback()
      })

      socket.on('sendLocation', (coords, callback) => {
          const user = getUser(socket.id)
          io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
          callback()
      })


      socket.on('disconnect', () => {
          const user = removeUser(socket.id)

          if (user) {
              io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
              io.to(user.room).emit('roomData', {
                  room: user.room,
                  user:user,
                  users: getUsersInRoom(user.room),
                  response:getUsersInRoom(user.response)
              })
          }
      })
  })

  server.listen(port, () => {
      console.log(`Server is up on port ${port}!`)
  })
// app.listen(port,()=>{
//   console.log("server started");
// })
reload(server, app);
