const express=require('express');
const Post=require("../models/posts")
const router=express.Router()

router


      .get("/posts/:id",(req,res)=>{
Post.findById(req.params.id).populate("messages").exec(function(err,found){
  if(!err)
    res.render("/",{post:found  })
})

})

     .post("/posts/:id/messages",isLoggedIn,(req,res)=>{


  Post.findById(req.params.id,(err,post)=>{
    if(err)
  {  console.log(err);
    redirect("/posts")

  }  else {

    Message.create(req.body.Message,(err,message)=>{
      if(err)
      console.log(err);
      else{
        message.author.id=req.user._id;
        message.author.username=req.user.username
        message.save()
        post.messages.push(message)
        post.save()

        res.redirect("/posts/"+post._id)
      }
    })
    }
  })
})
