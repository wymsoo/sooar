const express = require('express')
const router = express.Router()
const fs = require('fs');
const path = require('path')
const multer = require('multer')
const upload = require('../middlewares/uploadVid')


router.post('/newOrder', new_id, upload.array('files'), (req, res, err) => {
    try {
        if (!req.files) {
            console.log("ERROR1")
            res.json({ success: false, message: `File not found` })
            return;
        }
        if (err instanceof multer.MulterError) {
            console.log("ERROR2")
            // A Multer error occurred when uploading.
            return res.status(400).send(err.message);
        } else if (err && typeof err != 'function') {
            console.error(err)
            // An unknown error occurred when uploading.
            return res.status(500).send('An unknown error occurred.');
        }


        const purchase = req.body.purchase; // Access other form data
        const coach = req.body.instructor;
        var files = req.files; // Access the uploaded file
        console.log("HELLO", req.body.videoType)
        if (req.body.videoType == "fullMatchInput") {
            console.log("hello")
            const oldfilename = files[0].filename;
            const newfilename = files[0].filename.replace('set1', 'fullmatch');
            files[0].filename = files[0].filename.replace('set1', 'fullmatch');
            const oldFilePath = path.join(__dirname, '..', 'uploads', oldfilename);
            const newFilePath = path.join(__dirname, '..', 'uploads', newfilename);
            fs.rename(oldFilePath, newFilePath, (err) => {
                if (err) {
                    console.error('Error renaming file:', err);
                    return;
                }
                console.log('File renamed successfully!');
            });}

            const userdata = JSON.parse(fs.readFileSync('users.json'));
            const purchasedata = JSON.parse(fs.readFileSync('allPurchase.json'));

            let filePathArray=[];

            files.forEach((file)=>{
                console.log(file.filename)
                filePathArray.push(file.filename)
            })


            const order_date = new Date();
            const display_day = order_date.getDate();
            const display_month = order_date.getMonth() + 1;
            const display_year = order_date.getFullYear();
            const display_date = display_day + "-" + display_month + "-" + display_year
            const user_session = req.session.current_user;
            const question = req.body.question;
            let status1 = "locked"
            let status2 = "locked"
            let status3 = "locked";
            let status_f2f = "locked";
            let status_cv = "locked";

            if (purchase == "UF01" | purchase == "U001") {
                status1 = "pending";
                status2 = "pending";
                status3 = "pending";
                status_cv = "pending";
            }

            if (purchase == "S001") {
                status1 = "pending";
            }

            if (purchase == "UF01") {
                status_f2f = 1;
            }

            if (purchase == "CV01") {
                status_cv = "pending";
            }

            const initPurchase = {
                id: req.purchase_id,
                plan: purchase,
                date: display_date,
                stage: {
                    "1": {
                        "status": status1,
                        "message": "--",
                        "data": "--"
                    },
                    "2": {
                        "status": status2,
                        "message": "--",
                        "data": "--"
                    },
                    "3": {
                        "status": status3,
                        "message": "--",
                        "data": "--"
                    }
                },
                zoom: status_f2f,
                ordered_date: order_date,
                video: {
                    "status": status_cv,
                    "path": filePathArray
                },
                studentQuestion : question,
                instructor: coach,
                complete: false
            }


            userdata[user_session].purchased.push(initPurchase);

            const orderinfo = {
                user: user_session,
                info: initPurchase
            }

            purchasedata[initPurchase["instructor"]].orders[req.purchase_id] = orderinfo;

            fs.writeFileSync('users.json', JSON.stringify(userdata, null, 2));
            fs.writeFileSync('allPurchase.json', JSON.stringify(purchasedata, null, 2));


            res.json({ success: true, message: `File uploaded successfully: for user: ${purchase}` })
            // res.send(`File uploaded successfully: ${file.filename} for user: ${req.body.purchase}`);
        } catch (e) {
            console.error(e)
            return res.status(500).send('An unknown error occurred.');
        }
    });



function new_id(req, res, next) {
    const user_id = req.session.current_user;
    console.log(user_id)

    if (user_id == null) {
        res.status(401).send('Not Logged In');
    } else {
        const gen_id = (100 + Math.floor(Math.random() * 899))*10;
        req.purchase_id = gen_id;
        // Date.now() + '-mid-' + Math.round(Math.random() * 1E9);
        next();
    }

}

router.post("/newf2fOrder", (req, res) => {
    const { purchase, instructor } = req.body;
    const user_session = req.session.current_user;
    const userdata = JSON.parse(fs.readFileSync('users.json'));
    console.log(user_session);
    userdata[user_session].zoom_quotas += 1;
    fs.writeFileSync('users.json', JSON.stringify(userdata, null, 2));
    res.json({ success: true, message: `F2f Career Consultation successfully purchased.` })
})

router.post('/uploadCommentaryVideo', new_filename, upload.array('files'), (req, res, err) => {
    try {
        if (!req.files) {
            res.json({ success: false, message: `File not found` })
            return;
        }
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            return res.status(400).send(err.message);
        } else if (err && typeof err != 'function') {
            console.error(err)
            // An unknown error occurred when uploading.
            return res.status(500).send('An unknown error occurred.');
        }

        const coach = req.session.current_user;
        const userdata = JSON.parse(fs.readFileSync('users.json'));
        const purchasedata = JSON.parse(fs.readFileSync('allPurchase.json'));
        const userid = req.query.user;
        const purchaseid = req.query.purchaseid;
        console.log(userid, purchaseid)

        userdata[userid].purchased.forEach((purchase) => {
            if (purchase.id == purchaseid) {
                purchase.video.status = "complete"
            }
        })

        purchasedata[coach].orders[purchaseid].info.video.status = "complete";

        fs.writeFileSync('users.json', JSON.stringify(userdata, null, 2));
        fs.writeFileSync('allPurchase.json', JSON.stringify(purchasedata, null, 2));

        res.json({ success: true, message: "Successfully uploaded." })


    } catch (e) {
        console.error(e)
        return res.status(500).send('An unknown error occurred.');
    }
});

function new_filename(req, res, next) {
    const videopath = req.query.videopath;
    req.videopath = videopath
    next();
}

router.post('/submitOrder', (req, res) => {
    const orderid = req.query.orderid;
    const orderStage = req.body.stage; // '2' or '旁述影片'
    const userdata = JSON.parse(fs.readFileSync('users.json'));
    const purchasedata = JSON.parse(fs.readFileSync('allPurchase.json'));
    const user_session = req.session.current_user;
    const userinfo = userdata[user_session]; // get object of that user
    let message = "";
    // loop through the purchased array to find the id of the purchased item
    userinfo.purchased.forEach((purchase) => {
        console.log(purchase.id, parseInt(orderid))
        if (purchase.id === parseInt(orderid)) {
            // purchase.stage = { ...purchase.stage, ...orderStage };
            if (orderStage == "旁述影片") {
                purchase.video.status = "pending";
                purchasedata[purchase.instructor].orders[orderid].info.video.status = "pending";
            } else {
                purchase.stage[orderStage].status = "pending";
                purchasedata[purchase.instructor].orders[orderid].info.stage[orderStage].status = "pending";
            }
            message = "success";
            console.log(JSON.stringify(userinfo, null, 2));
            // Write the updated userinfo back to the file
            try {
                fs.writeFileSync("users.json", JSON.stringify(userdata, null, 2)); // Ensure correct variable
                fs.writeFileSync("allPurchase.json", JSON.stringify(purchasedata, null, 2));
                console.log('File successfully updated.');
            } catch (error) {
                console.error('Error writing to file:', error);
                return res.status(500).json({ message: 'Failed to update file' });
            }
            return res.json({ message });
        }
    });
    if (message === "") {
        console.log("XXXXXXXXXXX")
        message = "not successful";
        return res.json({ message });
    };

});

// submitting meeting request by student (booking)
router.post('/meetingRequest', upload.none(), (req, res) => {
    const student = req.session.current_user;
    const instructor = req.body.instructor;
    const description = req.body.description;
    const meetingdate = req.body.meetingdate;
    const preferred_meeting_time = req.body.preferred_meeting_time;
    const timeslot = req.body.timeslot;
    const consultation_type = req.body.consultation_type;

    if (student == null) {
        res.status(401).json({ success: false, message: "not logged in" });
        return;
    }
    const meetingRequests = JSON.parse(fs.readFileSync('meetingRequests.json'));
    const userdata = JSON.parse(fs.readFileSync('users.json'));
    userdata[student].zoom_quotas -= 1;

    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const idx1 = Math.floor(Math.random() * 1000) % 10
    const idx2 = Math.floor(Math.random() * 1000) % 10
    const idx3 = Math.floor(Math.random() * 1000) % 10

    const id = "M" + String(numbers[idx1] * 100 + numbers[idx2] * 10 + numbers[idx3])

    if (meetingRequests[instructor]) {
        meetingRequests[instructor].meetings[id] = { student, meetingdate, timeslot, preferred_meeting_time, consultation_type, description, resolved: "unresolved" }
    } else {
        meetingRequests[instructor] = {
            "meetings": { student, meetingdate, timeslot, preferred_meeting_time, consultation_type, description, resolved: "unresolved" }
        }
    }
    const newmeeting = {
        "instructor": instructor, meetingdate, timeslot, preferred_meeting_time, consultation_type, description,
        "resolved": "unresolved"
    }

    userdata[student].meetings[id] = newmeeting;

    fs.writeFileSync('meetingRequests.json', JSON.stringify(meetingRequests, null, 2));
    fs.writeFileSync('users.json', JSON.stringify(userdata, null, 2));
    res.json({ success: true, message: "Successfully submitted. Please wait for instructor to contact you." })

})


module.exports = router;
