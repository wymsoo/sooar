const express = require('express');
const router = express.Router();
const fs = require('fs');
const upload = require('../middlewares/uploadVid')

router.get('/writeReport', (req, res) => {
    const { userid, purchaseid, purchasedate, stage1, stage2, stage3 } = req.query;
    const instructor = req.session.current_user;
    const userdata = JSON.parse(fs.readFileSync('users.json'));
    const student = userdata[userid];
    const purchasedata = JSON.parse(fs.readFileSync('allPurchase.json'));
    const purchase = purchasedata[instructor].orders[purchaseid];
    const report = purchasedata[instructor].orders[purchaseid].info.stage;
    
    res.render('writeReport', { student, userid, purchase, purchaseid, purchasedate, report, stage1, stage2, stage3 });
})

router.get('/commentVideo', (req, res) => {
    const { userid, purchaseid, purchasedate } = req.query;
    const instructor = req.session.current_user;
    const purchasedata = JSON.parse(fs.readFileSync('allPurchase.json'));
    const video = purchasedata[instructor].orders[purchaseid].info.video;
    res.render('recording', { userid, purchaseid, purchasedate, video });
})

router.get('/playVideo', (req, res) => {
    const videoPath = req.query.videopath;
    res.render('videoPlayer', { videoPath })
})

router.post('/uploadReport', (req, res) => {
    const userid = req.query.user;
    const stage1 = req.query.stage1;
    const stage2 = req.query.stage2;
    const stage3 = req.query.stage3;
    console.log(userid);
    const purchaseid = req.query.purchaseid;
    const hexadata1 = req.body.hexadata1;
    const hexadata2 = req.body.hexadata2;
    const hexadata3 = req.body.hexadata3;
    const hexalabel1 = req.body.hexalabel1;
    const hexalabel2 = req.body.hexalabel2;
    const hexalabel3 = req.body.hexalabel3;
    const hexdarray1 = hexadata1.split(',')
    const hexdarray2 = hexadata2.split(',')
    const hexdarray3 = hexadata3.split(',')
    const hexalabelarr1 = hexalabel1.split(',')
    const hexalabelarr2 = hexalabel2.split(',')
    const hexalabelarr3 = hexalabel3.split(',')
    // console.log("CFUGHJJJJJK", hexadata1, hexdarray1, hexadata2, hexdarray2)

    const instructor = req.session.current_user;
    const { message1, message2, message3 } = req.body;
    const report = { message1, message2, message3 };
    const data = {
        "1": {
            "status": stage1,
            "message": report.message1,
            "data": [hexdarray1, hexalabelarr1]
        },
        "2": {
            "status": stage2,
            "message": report.message2,
            "data": [hexdarray2, hexalabelarr2]
        },
        "3": {
            "status": stage3,
            "message": report.message3,
            "data": [hexdarray3, hexalabelarr3]
        }
    }
    const userdata = JSON.parse(fs.readFileSync('users.json'));
    const purchasedata = JSON.parse(fs.readFileSync('allPurchase.json'));

    const instructordata = purchasedata[instructor];

    userdata[userid].purchased.forEach((purchase) => {
        if (purchase.id === parseInt(purchaseid)) {
            purchase.stage = data;
            purchase.complete = true;
            purchasedata[instructor].orders[purchaseid].info.stage = data;
            purchasedata[instructor].orders[purchaseid].info.complete = true;
            console.log("Success")
            res.render('displayPurchase', { instructordata, instructor });
        } else {
            console.log("ERROR");
        }
    });

    fs.writeFileSync('users.json', JSON.stringify(userdata, null, 2));
    fs.writeFileSync('allPurchase.json', JSON.stringify(purchasedata, null, 2));

});


router.post('/saveReport', (req, res) => {
    const userid = req.query.user;
    const hexadata1 = req.body.hexadata1;
    const hexadata2 = req.body.hexadata2;
    const hexadata3 = req.body.hexadata3;
    const hexalabel1 = req.body.hexalabel1;
    const hexalabel2 = req.body.hexalabel2;
    const hexalabel3 = req.body.hexalabel3;
    console.log(userid);
    const purchaseid = req.query.purchaseid;
    const stage2 = req.query.stage2;
    const stage3 = req.query.stage3;
    const instructor = req.session.current_user;
    const { message1, message2, message3 } = req.body;
    //console.log({ message1, message2, message3 });
    const report = { message1, message2, message3 };
    //console.log(report.message1);
    const data = {
        "1": {
            "status": "pending",
            "message": report.message1,
            "data": [hexadata1,hexalabel1]
        },
        "2": {
            "status": stage2,
            "message": report.message2,
            "data": [hexadata2,hexalabel2]
        },
        "3": {
            "status": stage3,
            "message": report.message3,
            "data": [hexadata3,hexalabel3]
        }
    }
    const userdata = JSON.parse(fs.readFileSync('users.json'));
    const purchasedata = JSON.parse(fs.readFileSync('allPurchase.json'));
    const instructordata = purchasedata[instructor];
    userdata[userid].purchased.forEach((purchase) => {
        if (purchase.id === parseInt(purchaseid)) {
            purchase.stage = data;
            purchasedata[instructor].orders[purchaseid].info.stage = data;
            console.log("Success")
            res.render('displayPurchase', { instructordata, instructor });
        } else {
            console.log("ERROR");
        }
    });

    fs.writeFileSync('users.json', JSON.stringify(userdata, null, 2));
    fs.writeFileSync('allPurchase.json', JSON.stringify(purchasedata, null, 2));

});

router.get('/displayAllPurchase', (req, res) => {
    const purchasedata = JSON.parse(fs.readFileSync('allPurchase.json'));
    const user = req.session.current_user;
    const instructordata = purchasedata[user];
    res.render('displayPurchase', { instructordata, user_session })

})

router.post('/addPreferredMeetingDates', (req, res) => {
    console.log("hi")
    const d = req.body.days;
    const y = req.body.year;
    const m = req.body.month;
    const start = req.body.startTime;
    const end = req.body.endTime;
    console.log("Start and end time: ", start, end)
    const userdata = JSON.parse(fs.readFileSync('users.json'));
    const user_session = req.session.current_user;
    const monthDict = {
        "0": "January",
        "01": "January",
        "1": "February",
        "02": "February",
        "2": "March",
        "03": "March",
        "3": "April",
        "04": "April",
        "4": "May",
        "05": "May",
        "5": "June",
        "6": "July",
        "7": "August",
        "8": "September",
        "9": "October",
        "10": "November",
        "11": "December",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        "10": "October",
        "11": "November",
        "12": "December"
    };

    const addedMonth = monthDict[m];
    let datetime;


    d.forEach((date) => {
        date = String(date)
        datetime = date+'-'+start
        userdata[user_session].meetingslots[y][addedMonth][datetime] = { start, end }
    });


    fs.writeFileSync('users.json', JSON.stringify(userdata, null, 2));
    console.log("Success")
    res.json({ success: true, message: "Successfully updated." });

})

router.post('/deleteMeetingTime',(req,res)=>{
    const month = req.body.month;
    const day = req.body.day;
    const start = req.body.start;
    const end = req.body.end;
    const user = req.session.current_user;

    var userdata = JSON.parse(fs.readFileSync('users.json'));
    delete userdata[user].meetingslots["2025"][month][day];
    fs.writeFileSync('users.json', JSON.stringify(userdata, null, 2));


    res.json({success:true, msg:`Deleted Event on ${month}-${day}`})
})

router.get('/coachScheduleSetting', (req, res) => {
    const user = req.session.current_user;
    const userdata = JSON.parse(fs.readFileSync('users.json'));
    const coach_info = userdata[user].meetingslots;
    console.log(coach_info)
    res.render('f2fRequests', { coach_info })
})

router.get('/displayMeetingRequests', (req, res) => {
    const meetingRequests = JSON.parse(fs.readFileSync('meetingRequests.json'));
    const user = req.session.current_user;
    const requests = meetingRequests[user].meetings;
    res.render('displayMeeting', { requests });
})

router.get('/resolveMeeting', (req, res) => {
    const meetingid = req.query.meetingid;
    const studentid = req.query.student;
    const user = req.session.current_user;
    const meetingRequests = JSON.parse(fs.readFileSync('meetingRequests.json'));
    const userdata = JSON.parse(fs.readFileSync('users.json'));

    userdata[studentid].meetings[meetingid].resolved = "resolved";
    meetingRequests[user].meetings[meetingid].resolved = "resolved";
    fs.writeFileSync('meetingRequests.json', JSON.stringify(meetingRequests, null, 2));
    fs.writeFileSync('users.json', JSON.stringify(userdata, null, 2));
    res.json({ success: true, message: "Meeting resolved. Data updated." })

})

router.get('/confirmMeeting', (req, res) => {
    const meetingid = req.query.meetingid;
    const studentid = req.query.student;
    const meetingtime = req.query.meetingTime;
    const meetingdate = req.query.meetingDate;
   
    const user = req.session.current_user;
    const meetingRequests = JSON.parse(fs.readFileSync('meetingRequests.json'));
    const userdata = JSON.parse(fs.readFileSync('users.json'));

    userdata[studentid].meetings[meetingid].resolved = "pending";
    meetingRequests[user].meetings[meetingid].resolved = "pending";
    userdata[studentid].meetings[meetingid].preferred_meeting_time = meetingtime;
    meetingRequests[user].meetings[meetingid].preferred_meeting_time = meetingtime;
    userdata[studentid].meetings[meetingid].meetingdate = meetingdate;
    meetingRequests[user].meetings[meetingid].meetingdate = meetingdate;
    fs.writeFileSync('meetingRequests.json', JSON.stringify(meetingRequests, null, 2));
    fs.writeFileSync('users.json', JSON.stringify(userdata, null, 2));
    res.json({ success: true, message: "Meeting confirmed. Data updated." })

})

router.get('/studentinfo', (req, res) => {
    const studentInfo = req.query.studentid;
    console.log(studentInfo)
    const userdata = JSON.parse(fs.readFileSync('users.json'));
    const studentdata = userdata[studentInfo]
    console.log(studentdata)
    res.render('studentInfo', { studentdata });
})

module.exports = router;


