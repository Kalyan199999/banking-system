const express = require('express')
const cookie = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()

const userRoute = require('./src/routes/auth.user-route.js')

const app = express();

app.use( express.json() );
app.use( cors() );

app.use( '/api/user/' , userRoute );

app.get( '/' , (req,res)=>{
    return res.status(200).json({
        ok:true,
        message:"Welcome to the backend banking system.Try differnet end points!"
    })
})

const port = process.env.PORT

app.listen(port , ()=>{
    console.log(`The server is started on the port:${port}`);
})

module.exports = app;