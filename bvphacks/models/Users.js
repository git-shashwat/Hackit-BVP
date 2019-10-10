const mongoose=require("mongoose")
mongoose.connect("mongodb://localhost:27017/bvpDB",{useNewUrlParser:true})
const passportLocalMongoose=require("passport-local-mongoose")

 var UserSchema=new mongoose.Schema({
   username:String,
   email:String,
   password:String,
   branch:Number,
   year: {
        type: Number,
        required: true
    },
    branch: {
        type: String,
        required: true,
        uppercase: true,
    },
    section: {
        type: Number,
        required: false,
    }

 })


 UserSchema.plugin(passportLocalMongoose)

 module.exports=mongoose.model("User",UserSchema)
