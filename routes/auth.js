const express = require('express');
const router = express.Router();
const fs = require('fs');


router.post('/register', (req, res) => {
    const { username, password, fullname, nickname, dob, phone, email, contactMethod } = req.body;
    console.log(username);
    const users = JSON.parse(fs.readFileSync('users.json'))
    if (username in users) {
        res.json({ success: false, message: "Registration Unsuccessful." })
    } else {
        users[username] = { role: "student", username, password, fullname, nickname, dob, phone, email, contactMethod, zoom_quotas: 0, purchased: [], meetings: {} };
        fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
        res.json({ success: true, message: "Successfully registered." });
    }
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const users = JSON.parse(fs.readFileSync('users.json'));
    let role = "";
    if (username in users) {
        console.log("ok");
        req.session.current_user = username;
        role = users[username].role;
        console.log(role);
        res.json({ status: true, message: "Logged in as " + username, role: role });

    } else {
        console.log("no")
        res.json({ status: false, message: "User does not exists.", role });
    }
});

router.get('/logout', (req, res) => {
    req.session.current_user = null;
    res.json({ success: true, message: "Successfully Logged Out." });
})

router.post('/registerCoach', (req, res) => {
    const { fullname, nickname, phone, email, sport, username, password } = req.body;
    const newCoach = {
        fullname, nickname, phone, email, sport, username, password,
        "meetingslots": {
            "2025": {
                "January": {},
                "February": {},
                "March": {},
                "April": {},
                "May": {},
                "June": {},
                "July": {},
                "August": {},
                "September": {},
                "October": {},
                "November": {},
                "December": {}
            }
        },
        role: "instructor"
    };

    const newdata = {
        orders: {}
    };

    const users = JSON.parse(fs.readFileSync('users.json'));
    const purchasedata = JSON.parse(fs.readFileSync('allPurchase.json'));
    if (username in users) {
        res.json({ success: false, message: "User exists. Please login." })
    } else {
        users[username] = newCoach;
        purchasedata[username] = newdata;
        fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
        fs.writeFileSync('allPurchase.json', JSON.stringify(purchasedata, null, 2));
        res.json({ success: true, message: "Successfully registered." });
    }
});


module.exports = router;
