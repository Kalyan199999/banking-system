const express = require('express')

const {
    authentication
} = require('../middlewares/auth.json-token.js');

const {
    addNewTranscation
} = require('../controllers/transcations.controllers.js')

const route = express.Router();

route.post( '/' , authentication , addNewTranscation );

module.exports = route;