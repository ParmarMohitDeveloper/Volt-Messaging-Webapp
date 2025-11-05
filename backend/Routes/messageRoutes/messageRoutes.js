const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { getMessages, postMessage } = require('../../Controller/messageController/messageController');

router.get('/get/msg/:chatId', auth, getMessages);
router.post('/create/msg', auth, postMessage);

module.exports = router;
