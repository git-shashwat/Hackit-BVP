const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/bvpDB",{useNewUrlParser:true})

 var UserSchema=new mongoose.Schema({
   username:String,
   password:String

 })

 // UserSchema.plugin(passportLocalMongoose)

 module.exports=mongoose.model("User",UserSchema)
