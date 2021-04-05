const mongoose = require('mongoose')
const User = require('./user.js')
const Bus = require('./Bus.js')
const uniqueValidator = require('mongoose-unique-validator');
const TicketSchema = new mongoose.Schema({

    seatNo: { 
        type: Number, 
        unique:true
    },
    isBooked: { 
        type: Boolean, 
        default:false
    },
    costOfticket:{
        type:Number,
        require:true
    },
    user:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref:'User',
        require:true,
    },
    bus:{
        type:mongoose.Schema.Types.ObjectId,
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
