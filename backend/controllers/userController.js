const db = require("../config/firebase");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

module.exports = {
  register: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        let { username, phone } = userData;
        const user = await db.collection("users").doc(phone).get();
        let response = {};
        if (user.data()) {
          response.code = 409;
          response.success = false;
          response.message = "User exists with the same phone number";
          resolve(response);
        } else {
          let { username, phone, password } = userData;
          const id = phone;
          const usersDb = db.collection("users");
          let hashedPassword = await bcrypt.hash(password, 10);
          const token = jwt.sign(
            { phone },
            process.env.TOKEN_KEY || "something secret",
            {
              expiresIn: "5h",
            }
          );
          let data = {}
          data.user = username
          data.phone = phone
          await usersDb.doc(id).set({ username, phone, hashedPassword }).then((result) => {
              response.code = 200;
              response.success = true;
              response.message = "Registered successfully";
              response.data = data
          });
          resolve(response);
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  login:(userData)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            let {phone,password} = userData
            let user = await db.collection("users").doc(phone).get()
            let response = {}
            if (user.data()){
                await bcrypt.compare(password, user.data().hashedPassword).then((isSame)=>{
                    if (isSame){
                        let username = user.data().username
                        response.code = 200
                        response.success = true
                        response.message = "login successfully"
                        response.user = user.data()
                        const token = jwt.sign(
                          { username,phone },
                          process.env.TOKEN_KEY || "something secret",
                          {
                            expiresIn: "5h",
                          }
                        );
                        response.token = token;
                    }else{
                        response.code = 403;
                        response.success = false;
                        response.message = "Invalid credentials"
                    }
                })
            }else{
                response.code = 403;
                response.success = false;
                response.message = "Invalid credentials";
            }
            resolve(response)
        } catch (error) {
            reject(error)
        }
    })
  },
  addPost:(userData,postData)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            let { caption, content } = postData;
            let { username, phone } = userData;
            const id = caption;
            let response = {};
            const postDb = db.collection("post");
            await postDb
              .doc(id)
              .set({ username, caption, content, phone })
              .then((result) => {
                response.code = 200;
                response.success = true;
                response.message = "Post added";
              });
            resolve(response);
        } catch (error) {
            reject(error)
        }
    })
  },
  getAllPost:()=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const post = await db.collection("post");
            let postArr = [];
            let response = {};
           
            if (post){
                post.get().then((documents) => {
                  documents.forEach((doc) => {
                    postArr.push(doc.data());
                   
                    response.code = 200;
                    response.success = true;
                    response.data = postArr;
                    resolve(response);
                  });
                });
            }
        } catch (error) {
            reject(error)
        }
    })
  },
  
  getPost:(caption)=>{
  return new Promise(async(resolve, reject) => {
    let post = await db.collection("post").doc(caption).get()
    let response = {}
    if (post.data()) {
    response.code = 200
    response.success = "success" 
    response.data = post.data()
    resolve(response);
    } else {
      response.code = 404
    response.success = "failure" 
    response.data = null
    resolve(response);
     
    }
   
  })
  },
  updatePost:(caption,newcaption) =>{
    return new Promise(async(resolve, reject) => {
      let post = await db.collection("post").doc(caption).update({caption : newcaption});
      if (post) {
      let response = {}
        response.code = 200
        response.success = "success" 
        response.data = post
        resolve(response);
      }
    
     
    })
  }
};
