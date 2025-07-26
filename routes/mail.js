const express = require('express');
const controllers=require('../controllers/mailController');
const router = express.Router();

router.get('/user/:email',controllers.getUser)
router.post('/send',controllers.sendMail);
router.get('/drafts/:email', controllers.getDrafts);
router.get('/read/:messageId', controllers.readMail);

module.exports = router;