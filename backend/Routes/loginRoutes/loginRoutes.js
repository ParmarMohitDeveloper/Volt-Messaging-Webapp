const express = require("express");
const router = express.Router();
const { loginControl } = require("../../Controller/loginControl/loginControl");


router.route('/login').post(loginControl);

module.exports = router