'use strict';

var express = require('express');
var controller = require('./user.controller');

var router = express.Router();

router.get('/get/worlds', controller.worlds)

module.exports = router;
