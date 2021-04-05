const express = require('express')
const ticketUtils = require('../database/ticket.js');
const Ticket = require('../model/ticket.js')
const Bus= require('../model/Bus.js')
const auth=require("../middleware/auth.js")
const {check,validationResult}=require("express-validator/check");



const router=express.Router();
// booked ticket
router.post('/ticket',[auth,[
    check('seatNo','please enter a seatnumber').not().isEmpty(),
    check('isBooked','isbooked status is requried').not().isEmpty(),
    check('bus','bus number is requried').not().isEmpty(),
]],async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
     return  res.status(400).json({errors:errors})   
    }
    const{seatNo,isBooked,bus}=req.body;
    ticketinfo={};
    ticketinfo.user=req.user.id
    if(seatNo)ticketinfo.seatNo=seatNo;
    if(isBooked)ticketinfo.isBooked=isBooked;
    if(bus)ticketinfo.bus=bus;
    try{
        const seatnumber=await Ticket.findOne({seatNo})
        if(seatnumber){
            res.status(404).json({msg:"seat number aleardy is booked"})
            console.log('seat is booked')
        }
        
            const ticket=new Ticket(ticketinfo)
            const createdTickets = await ticketUtils.createMany(ticket)
            console.log(createdTickets)
            if(createdTickets){
                res.status(201).json({message: 'Tickets booked successfully'});
                ticket.save()
            }else{
                res.status(404).json('some db error')
            
            }
    }catch(err){
        console.log(err)
    }
})

// get list of all closed tickets
router.get('/closed/:busNumber/:bus_id', async(req, res) => {
        
    try{
            const busNumber = req.params.busNumber   
            const busNo= await Bus.findOne({busNumber})
            if(!busNo){
                res.status(404).json('bus number not found')
            }
            const { bus_id } = req.params
            const ticket =  Ticket.findById(bus_id)
            if(ticket){
                const tickets= await Ticket.find({isBooked:true})
                res.status(201).json(tickets) 
            }     
        }
    catch(err){
        res.status(404).json(err)
        console.log(err)        
    }
}),
// get list of all open tickets
router.get('/opend/:busNumber/:bus_id', async(req, res) => {
    try{
            const busNumber = req.params.busNumber   
            const busNo= await Bus.findOne({busNumber})
            if(!busNo){
                res.status(404).json('bus number not found')
            }
            const { bus_id } = req.params
            const ticket =  Ticket.findById(bus_id)
            if(ticket){
                const tickets= await Ticket.find({isBooked:false})
                res.status(201).json(tickets) 
            } 
            res.status(201).json(ticket)      
        }
    catch(err){
        res.status(404).json(err)
        console.log(err)        
    }
}),

// view ticket status
router.get('/ticket/:busNumber/:ticket_id', async(req,res)=>{
    try{
        const busNumber=req.params.busNumber
        
        const busNo= await Bus.findOne({busNumber})
        if(!busNo){
            res.status(404).json('bus number not found')
        }
        const { ticket_id } = req.params
        const ticket = await  Ticket.findById(ticket_id);
        if(ticket){
            res.status(201).json(ticket.isBooked)
        }
        
    }
    catch(err){
        res.status(404).json(err)
    }
})


//View Details of person owning the ticket.
router.get('/detail/:busNumber/:ticketid',async(req,res)=>{
    try{
        const busNumber=req.params.busNumber
        const busNo= await Bus.findOne({busNumber})
        if(!busNo){
            res.status(404).json('bus number not found')
        }
        const { ticket_id } = req.params

        const ticketid = Ticket.findById(ticket_id);
        if(ticketid){
            const ticket=await Ticket.findOne().populate('user',[])
            res.status(200).json(ticket)
        }
        
    }
    catch(err){
        console.log(err)
        res.status(404).json(err)        
    }
}),


module.exports = router
