const mongoose=require('mongoose')
var postsSchema=new mongoose.Schema({
  name:String,
  image:String,
  description:String,
  author:{
    id:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    username:String
  },
  messages:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  }]

}
)

var Message=mongoose.model("Message",postsSchema)

module.exports=Message;
