const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { getChats, accessChat } = require('../../Controller/chatControl/chatControl');

router.get('/get/chats', auth, getChats);
router.post('/create/chat', auth, accessChat);

module.exports = router;
