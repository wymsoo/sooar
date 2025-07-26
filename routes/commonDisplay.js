const express = require('express');
const router = express.Router();

router.get('/home', (req, res) => {
    const user_session = req.session.current_user;
    res.render('home', { user_session });
})

module.exports = router;