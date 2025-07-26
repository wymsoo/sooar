const express = require('express')
const router = express.Router();

const { askDeepSeek } = require('../aichat/aiResponse')

router.post('/askDeepSeek', (req, res) => {
    const { question } = req.body;
    console.log(question)
    askDeepSeek(question).then((msg) => {
        console.log("Received message:", msg);
        console.log("MESSAGE RECEIVED")
        res.json({ success: true, msg });
    }).catch((error) => {
        console.error("Error in askDeepSeek:", error);
        res.status(500).json({ success: false, error: "Something went wrong." })
    })
})

module.exports = router;