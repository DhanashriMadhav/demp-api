const express = require('express')
const Bus = require('../model/Bus.js')
const validation=require("../validation/busvalidation.js")
const busValidation = validation.busValidation


const router = express.Router()

router.post('/bus',async(req,res)=>{
    
    let [result, data] = busValidation(req.body)
    if (!result) return res.status(404).json({data})
    try{ 
        const bus =new Bus(req.body)
        const newbus =await bus.save()
        if(newbus){
            return res.send(bus.id);
        }else{
            return res.send({"error":"something went wrong"})
       
    }}
    catch(err) {
        console.log(err)
        res.status(404).send('some server error')
    }
       
}),
//get the data of bus
router.get('/bus', async(req, res)=>{
        await Bus.find((err,data)=>{
    
        }).then((data)=>{
    
            res.status(200).json(data)
        }).catch((err)=>{
            res.status(404).json(err)
        })
})


module.exports = router
