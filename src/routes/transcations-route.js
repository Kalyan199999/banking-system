const express = require('express')

const {
    authentication
} = require('../middlewares/auth.json-token.js');

const {
    addNewTranscation,
    getBalance
} = require('../controllers/transcations.controllers.js')

const route = express.Router();

route.post( '/' , authentication , addNewTranscation );
route.get( '/' , authentication , getBalance );

module.exports = route;