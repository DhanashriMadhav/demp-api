const express = require('express')
const Ticket = require('../model/ticket.js')
const auth = require('../middleware/auth.js')
const User = require('../model/user.js')
const {check,validationResult}=require("express-validator/check")
const ticketUtils = require('../database/ticket.js')
const router = express.Router()

router.post('/book',[auth,[

    check('isBooked','status is required')
    .not()
    .isEmpty(),
    check('seatNo','seat no is requires')
    .exists()
    .not()
    .isEmpty()

    ]
],async(req,res)=>{
        const errors =validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors});
        }

        const {
        
            seatNo,
            isBooked,
            bus
        } = req.body;

        ticketFields = {};
        ticketFields.user = req.user.id;
        if(seatNo)ticketFields.seatNo = seatNo;
        if(isBooked)ticketFields.isBooked = isBooked;
        if(bus)ticketFields.bus = bus;

        try{
            const seatno = await Ticket.findOne({seatNo})
            if(seatno){
                res.status(404).json({msg:'already booked'})
            }
         // create
         const ticket = new Ticket(ticketFields);
         
         const createdTickets =await ticketUtils.createMany(ticket);
         console.log(createdTickets)
         if(createdTickets){
            res.status(201).json({msg: "tiket added successfully"});
            ticket.save();
         }else{
             res.status(404).json({msg:"error"})
         }
         

     }catch(err){
         console.error(err);
         res.status(500).send('server error')

     }
 }
 );





// view ticket status
router.get('/ticket/:busNumber/:ticketId', async(req,res)=>{
    try{
    const busNumber=req.params.busNumber
    const ticket_id = req.params.ticketId;
    const ticket=   await Ticket.find(busNumber,ticket_id);
    res.status(200).json(ticket)
    }
    catch(err){
        res.status(404).json(err)
    }
})

// get list of all open tickets
router.get('/open/:busNumber', async (req, res) => {
    try{
        const busNumber=req.param.busNumber
        const ticket= await Ticket.find({busNumber, isBooked: false})
        res.status(200).json(ticket) 
    }
    catch(err){
        res.status(404).json( err )
    }
})

// get list of all closed tickets
router.get('/closed/:busNumber', async(req, res) => {
    try{
            const busNumber = req.param.busNumber
            const busno= await Bus.findOne({busNumber})
                console.log(busno)
                if(busno){
                    const ticket = await Ticket.find({isBooked: true})
                    res.status(200).json(ticket)
                }      
        }
    catch(err){
        res.status(404).json(err)
        console.log(err)        
    }
}),


//View Details of person owning the ticket.
router.get('/detail/:busnumber/:ticketnumber',async(req,res)=>{
    try{
        const busNo=req.param.busNumber
        const ticketno=req.param.ticketId
        await Ticket.find({busNumber:busNo,ticketId:ticketno},(err,ticket)=>{
            // if (err) res.status(404).json({ message: err })
            if(ticket){
                User.findById(ticket.passenger, (err, user) =>{
                        console.log(ticket.passenger)
                    if (err) res.status(404).json({ message: err })
                        console.log(err)
                    if (user) res.status(200).json(user)
                        console.log(user)
                })
            }
        })
    }
    catch(err){
        res.status(404).json(err)        
    }
});

module.exports = router
