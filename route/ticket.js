const express = require('express')
const Ticket = require('../model/ticket.js')
const User = require('../model/user.js')


const router = express.Router()
// //create ticket
var total_booked_seats=[ ]
router.post('/ticket',async(req,res) => {
    const ticket = new Ticket(req.body)
    if(total_booked_seats.includes(req.body.bus_number)){
        res.send("seat already booked")
    }else{
            var newticket = await ticket.save()
            var seat_number=(req.body.seatNo)
            total_booked_seats.push(seat_number)
            console.log(total_booked_seats)
    } 
    console.log(newticket," debuggggg")
    if(newticket){
        return res.send({'Sucess':"1"});
    }else{
        console.log(err)
        return res.send({"error":"something went wrong"})
        // console.log("something went wrong")
    }
}),




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
}),

module.exports = router
