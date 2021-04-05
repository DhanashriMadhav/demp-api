const exprees= require("express");
const connectDB =require("./config/db.js");
const bodyParser = require('body-parser')

const app = exprees()
app.use(bodyParser.json())

// Configuring the database
connectDB();
const ticket=require("./database/ticket.js")
const auth=require("./route/auth.js")
const apiRoutes = require("./route/ticket.js")
const user = require('./database/user.js')
const bus=require("./database/bus.js")
app.use('/api', apiRoutes)
app.use('/api', user)
app.use('/api',bus)
app.use('/api',auth)
app.use('/api',ticket)


// listen for requests
app.listen(7900, () => {
   console.log("Server is listening on port 7900");
});


 
