const express = require("express");
const db = require("../config/firebase");
const userController = require("../controllers/userController");
const auth = require('../utils/utils')
const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send("user router called");
});

userRouter.post('/register',(req,res)=>{
    let userData = req.body
    userController.register(userData).then((result)=>{
        res.send(result)
    })
})

userRouter.post('/login',(req,res)=>{
    console.log(req.body)
    let loginData = req.body
    userController.login(loginData).then((result)=>{
        res.send(result)
    })
})

userRouter.get('/post',auth,(req,res)=>{
    let user = req.user
    console.log(user)
    userController.getAllPost().then((result)=>{
        res.send(result);
    })
    
})

userRouter.post('/add-post',auth,(req,res)=>{
    let postData = {
        caption: req.body.caption ? req.body.caption : '',
        content: req.body.content ? req.body.content : ''
    }
    userController.addPost(req.user, postData).then((result)=>{
        res.send(result)
    })
})

userRouter.get('/get-post/:id',auth,(req,res)=>{
   
    let caption = req.params.id
    userController.getPost(caption).then((result)=>{
        res.send(result)
    })
})

userRouter.post('/update-post/:id',auth,(req,res) =>{
   
    let caption = req.params.id
    let newcaption = req.body.caption
    userController.updatePost(caption,newcaption).then((result)=>{
    res.send(result) 
    })

})



module.exports = userRouter;
