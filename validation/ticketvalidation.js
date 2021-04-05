const Joi = require('@hapi/joi')

function validateObj(obj, schema) {
    let result = null
    Joi.validate(obj, schema, (err, data) => {
        if (err) {
            result = [false, err]
        }
        else {
            result = [true, data]
        }
    })
    return result
}

function ticketValidation(ticket) {
  
    const ticketSchema = Joi.object().keys({
   
    seatNo: Joi.number().optional(),
    isBooked: Joi.boolean().default(false),
    costOfticket:Joi.number().required(true),
    user:Joi.string().optional(),
    bus:Joi.string().required(true),
    })
    return validateObj(ticket,ticketSchema)
}

module.exports = {
    ticketValidation: ticketValidation,
}
