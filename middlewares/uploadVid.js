const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads') // modified destination path
    },
    filename: function (req, file, cb) {
        console.log("File: \n", file)
        console.log("File array: \n ", req.files)
        let newfilename;
        let filetype = path.extname(file.originalname)
        const filenameEnd = ['set1', 'set2', 'set3', 'set4', 'set5']
        const index = req.files.length - 1;


        if (req.purchase_id) {
            newfilename = req.session.current_user + "-" + req.purchase_id + "-" + filenameEnd[index]
            cb(null, newfilename + filetype) // modified created file name
        } else if (req.videopath) {
            newfilename = req.session.current_user + "-" + req.videopath
            cb(null, newfilename + filetype)
        }
        /*
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // cb(null, file.fieldname + '-' + uniqueSuffix)
    
        // cb(null, file.originalname)
        cb(null, file.fieldname + '-' + uniqueSuffix + "." + filetype)
        */
    }
})

const upload = multer({
    storage,
    limits: {
        fileSize: 10000 * 1024 * 1024 // Limit to 100 MB
    }
});

module.exports = upload;
