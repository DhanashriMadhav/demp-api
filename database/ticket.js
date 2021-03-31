const Ticket = require('../model/ticket.js');

exports.createMany = async(tickets) => {
    try{
        const createdTickets = await Ticket.insertMany(tickets);
        return createdTickets;
    }
    catch(error){
        error.message = 'Some db error!';
    }
}

// exports.deleteManyTickets = async(tickets) => {
//     try{
//         await Ticket.deleteMany({_id: {$in: tickets}});
//         return;
//     }
//     catch(error){
//         error.message = 'Some db error!';
//     }
// }