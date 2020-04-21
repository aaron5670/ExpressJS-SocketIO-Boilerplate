const express = require('express');
const init = express.Router();
const path = require('path');
const authRoute = require('./auth/auth')

init.use('/auth/', authRoute)

module.exports = init
