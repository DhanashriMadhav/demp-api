const express= require("express")
const connectDB =require("./config/db.js");
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())

// Configuring the database
connectDB();

const auth=require("./route/auth.js")
const ticket = require("./route/ticket.js")
const user = require('./route/user.js')
const bus=require("./route/bus.js")
app.use('/api', ticket)
app.use('/api', user)
app.use('/api',bus)
app.use('/api',auth)

// listen for requests
app.listen(7900, () => {
   console.log("Server is listening on port 7900");
});



