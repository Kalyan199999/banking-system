const express = require('express')

const {
    authentication
} = require('../middlewares/auth.json-token.js');

const {
    transferTranscation,
    depositTranscation,
    withdrawTranscation,
    getBalance,
    fetchUserTranscations
} = require('../controllers/transcations.controllers.js')

const route = express.Router();

route.post( '/transfer' , authentication , transferTranscation );
route.post( '/deposit' , authentication , depositTranscation );
route.post( '/withdraw' , authentication , withdrawTranscation );

route.get( '/' , authentication , getBalance );
route.get( '/user-transcations' , authentication , fetchUserTranscations );

module.exports = route;