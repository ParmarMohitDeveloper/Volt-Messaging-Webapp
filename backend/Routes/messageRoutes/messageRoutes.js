const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {
  getMessages,
  postMessage,
  editMessage,
  deleteMessage
} = require('../../Controller/messageController/messageController');

router.get('/get/msg/:chatId', auth, getMessages);
router.post('/create/msg', auth, postMessage);
router.patch('/update/msg/:messageId', auth, editMessage);
router.delete('/delete/msg/:messageId', auth, deleteMessage);

module.exports = router;
