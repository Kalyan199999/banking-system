const express =  require('express')
const {
    craeteNewAcctount,
    getAccountDetails
} = require('../controllers/accounts.controller.js');

const {
    authentication
} = require('../middlewares/auth.json-token.js');

const route = express.Router();

route.post( '/' , authentication , craeteNewAcctount);
route.get( '/' , authentication , getAccountDetails );

module.exports = route;