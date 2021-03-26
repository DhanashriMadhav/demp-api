const express = require('express')
const User = require('../model/user.js')
const jwt=require("jsonwebtoken")
const bcrypt=require("bcryptjs")
const config=require("../config/config.json")
const validation=require("../validation/uservalidation.js")
const uservalidation = validation.userValidation

const router = express.Router()

//post the data of user
router.post('/user', async(req,res)=>{
    let [result, data]=uservalidation(req.body)
    if(!result) return res.status(404).json({data})

    const {name,gender,email,password}=req.body;
    try{
           //see user exite
           let user = await User.findOne({email });
           if(user){
               res.status(400).json({errors:[{msg:"user already exits"}]})
           }

           user = new User({
            name,
            gender,
            email,
            password
        });
          //encrypt password
          const salt = await bcrypt.genSalt(10);

          user.password=await bcrypt.hash(password,salt)

          await user.save();

          //return jsonwebtoken
          const payload={
            user:{
                id:user.id
            }
        }
        jwt.sign(payload,
            config.jwtSecret,
            {expiresIn:360000},(err,token)=>{
                if(err)throw err;
                res.json({token});
            });


    }catch(error){
        console.log(error)
        res.status(500).send('server error')
    }

    
}),
//get the data of user
router.get('/user', async(req, res)=>{
        await User.find((err,data)=>{
    
           })
        .then((data)=>{
    
            res.status(200).json(data)
        }).catch((err)=>{
            res.status(404).json(err)
        })
        })



module.exports = router
