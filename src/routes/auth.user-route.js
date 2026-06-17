const express = require('express');
const multer = require('multer');

const { authentication } = require('../middlewares/auth.json-token.js');

const storage = multer.memoryStorage({});
const upload = multer({storage:storage});

const { 
    registration,
    login,
    update,
    forgetPassword
} = require('../controllers/user.controller.js');

const route = express.Router();

route.get( '/' , (req,res)=>{
    return res.status(200).json({
        ok:true,
        message:"Welcome to the backend banking system.Try differnet end points!"
    })
})

route.post( '/' , upload.single('avatar') , registration );

route.post( '/login' , login );

route.patch( '/edit' , authentication , upload.single('avatar') , update );

route.patch( '/forget-password' , forgetPassword );

module.exports = route;