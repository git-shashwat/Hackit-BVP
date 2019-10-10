const mongoose=require('mongoose')

var messageSchema=mongoose.Schema({
  text:String,
  author:{
    id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    username:String
  }
})

var Message=mongoose.model("Comment",messageSchema)
module.exports = Message
