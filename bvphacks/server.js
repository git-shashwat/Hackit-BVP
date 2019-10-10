
const express=require("express")
const app=express()
app.set('view engine','ejs')
const mongoose=require('mongoose')
mongoose.connect("mongodb://localhost:27017/bvpDB"
,{useNewUrlParser:true})
const bodyParser=require("body-parser")
const passport=require("passport")
const LocalStrategy=require("passport-local")
const passportLocalMongoose=require("passport-local-mongoose")
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname+"/public"))
const methodOverride=require("method-override")
app.use(methodOverride("_method"))
const User=require("./models/users")
const Add=require("./models/adds")
const Chat=require("./models/Chat")

var flash=require("connect-flash")

app.use(flash())

app.use(require("express-session")({
secret:"1234",
unsave:false,
saveUnitialized:false

}))


app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{

  res.locals.currentUser=req.user;
res.locals.error=req.flash("error");
res.locals.success=req.flash("success");
  next();
})



const add1 = new Add({
  name: "Shitij",
  image:"vernier.jpg",
  description:"Akash 3rd Sem Books",
  room:206
})
const add2 = new Add({
  name: "Shaswat",
  image:"book.jpg",
  description:"Vernier Calliper",
  room:207
})
const add3 = new Add({
  name: "Rishab",
  image:"paper.jpg",
  description:"GGSIPU End Term Papers",
  room:208
})

const defaultItems=[add1,add2,add3]

app.get("/",(req,res)=>{


  Add.find({},(err,adds)=>{
    if(!err)
   {   if (adds.length === 0) {
       Add.insertMany(defaultItems, (err) => {
         if (err) {
           console.log("Error!");
         } else
           console.log("Successfully saved!");
       })
       res.redirect("/")
     } else{
       console.log(adds);
       res.render("index",{adds:adds,currentUser:req.user})}

     }

     })
})




app.post("/adds",(req,res)=>{
var name=req.body.name;
var image=req.body.image;
var description=req.body.description;
var  price=req.body.price;
var lender={
  id:req.user._id,
  username:req.user.username
}
var newadd={name:name,price:price,image:image,description:description,lender:lender}

Add.create(newadd,function(err,add){
if(err)
console.log(err);
res.redirect("/")
})


})

app.get("/signup",(req,res)=>{
res.render("signup")
})
app.get("/login",(req,res)=>{
  res.render("login")
})



app.post("/signup",(req,res)=>{
User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{
if(err)
{  req.flash("error",err.message)

  console.log(err);
  return res.render("signup")
}
passport.authenticate("local")(req,res,()=>{
  req.flash("success","Welcome to Yelpcamp "+ user.username)

res.redirect("/index")

})
})
})


app.get("/login",(req,res)=>{
  res.render("login")

})


app.post("/login",passport.authenticate("local",{
  successRedirect:"/",
  failureRedirect:"/login"
}),(req,res)=>{

} )

app.get("/logout",(req,res)=>{
req.logout();
res.redirect("/index")

})




function check(req,res,next){

  if(req.isAuthenticated())
    {
      Post.findById(req.params.id,(err,found)=>{
        if(err){
          res.redirect("back")
        }
        else{
          if(found.author.id.equals(req.user._id)){
next()  }else{    req.flash("error","You don't have permission to do that!")

    res.redirect("back")
  }}
      })

    }else {  req.flash("error","Permission Denied!")
    res.redirect("back")
    }


}

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }
  req.flash("error","You Need To Be Logged In To Do That!")
  res.redirect("/login")
}

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);
