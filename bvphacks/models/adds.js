const mongoose=require('mongoose')
var postsSchema=new mongoose.Schema({
  name:String,
  image:String,
  description:String,
  lender:{
    id:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    username:String
  },
  messages:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  }],
  room:Number

}
)

var Add=mongoose.model("Add",postsSchema)

module.exports=Add;
