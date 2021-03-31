const mongoose = require('mongoose')
const User = require('../model/user.js')
const uniqueValidator = require('mongoose-unique-validator');
const Bus = require('../model/Bus.js')
const TicketSchema = new mongoose.Schema({

    seatNo: { 
        type: Number, 
        max:40,
        required: true,
        unique:true
    },
    isBooked: { 
        type: Boolean, 
        default:false
    },
    ticketCost:{
        type:Number
    },
    passenger: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref:'User',
        require:true,
    },
    bus:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Bus',
        require:true,
    }
},
{
    timestamps: true
});
TicketSchema.plugin(uniqueValidator, {
    type: 'mongoose-unique-validator',
    message: 'Error, expected {PATH} to be unique.'
});


module.exports = mongoose.model('Ticket', TicketSchema)      
