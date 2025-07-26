const express = require('express')
const router = express.Router();
const fs = require('fs');
const upload = require('../middlewares/uploadVid')

router.get('/newpurchase', (req, res) => {
    const userdata = JSON.parse(fs.readFileSync('users.json'));
    let coachlist = [];
    Object.keys(userdata).forEach((user) => {
        if (userdata[user].role == "instructor") {
            coachlist.push(userdata[user])
        }
    })
    res.render('newpurchase', { coachlist });
})

router.get('/f2fpurchase', (req, res) => {
    const userdata = JSON.parse(fs.readFileSync('users.json'));
    let coachlist = [];
    Object.keys(userdata).forEach((user) => {
        if (userdata[user].role == "instructor") {
            coachlist.push(userdata[user])
        }
    })
    res.render('f2fpurchase', { coachlist });
})


router.get('/purchase', (req, res) => {
    const userdata = JSON.parse(fs.readFileSync('users.json'));
    const user_session = req.session.current_user;
    const userinfo = userdata[user_session];
    res.render('purchase', { userinfo, user_session });

});

router.get('/', (req, res) => {
    const userdata = JSON.parse(fs.readFileSync('users.json'));
    const purchasedata = JSON.parse(fs.readFileSync('allPurchase.json'));
    const user_session = req.session.current_user;
    let instructordata = "";
    for (const user in userdata) {
        const userinfo = userdata[user];
        if (user === user_session) {
            if (userinfo.role === "student") {
                res.render('reports', { userinfo, user_session })
            }
            else if (userinfo.role === "instructor") {
                instructordata = purchasedata[user]
                res.render('displayPurchase', { instructordata, user_session })
            }
        };
    }

});

router.get('/studentSpace',(req,res)=>{
    const user_session = req.session.current_user;
    res.render('studentSpace', {user_session})
})

router.get('/report1', (req, res) => {
    const get_id = req.query.id; //stage: "5001"
    console.log("GET ID: ", typeof get_id);
    var get_stage = get_id[get_id.length - 1]; // 1
    console.log("GETSTAGE: ", get_stage)
    const purchaseID = parseInt(get_id) - parseInt(get_stage); //"5000"
    console.log("PURCHASE ID: ", purchaseID);
    get_stage = String(get_stage)
    const userdata = JSON.parse(fs.readFileSync('users.json'));
    const user_session = req.session.current_user;
    const user = userdata[user_session];
    let coachname;
    user.purchased.forEach((purchase) => {
        console.log(purchase.id);
        if (parseInt(purchase.id) === purchaseID) {
            coachname = userdata[purchase.instructor].fullname
            res.render('report1', { purchase, get_stage, coachname, user_session })
            return
        } else {
            console.log('error');
        }
    });

});

router.get('/studentPlayVideo', (req,res)=> {
    const videoPath = req.query.videopath;
    res.render('videoPlayer_stud', { videoPath })
})

router.get('/videos', (req, res) => {
    const videoPath = req.query.videopath;
    res.sendFile(__dirname + "/uploads/" + videoPath, (err) => {
        if (err) console.log(err)
    })
})


router.get('/f2fbooking', (req, res) => {
    const userdata = JSON.parse(fs.readFileSync('users.json'));
    const user_session = req.session.current_user;
    const userinfo = userdata[user_session];
    let slots = [];
    Object.keys(userdata).forEach(user => {
        if (userdata[user].role == "instructor") {
            slots.push(userdata[user])
        }
    })
    res.render('f2fbooking', { slots, userinfo, user_session })
})

router.get('/studentMeetings', (req, res) => {
    const user = req.session.current_user
    const userdata = JSON.parse(fs.readFileSync('users.json'))
    const meetings = userdata[user].meetings
    res.render('s_displayMeeting', { meetings });
})


module.exports = router;


