const express = require('express');

const router = express.Router();

const {verifyOTP} = require('../../Controller/verifySignUpControl/verifySignUpControl');

router.route('/verify/signup').post(verifyOTP);


module.exports = router;