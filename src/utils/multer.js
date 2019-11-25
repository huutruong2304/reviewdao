const multer = require('multer')
const util = require('util')

const storage = multer.diskStorage({
    // destination: function(req, file, cb) {
    //     cb(null, 'public/img/postImages')
    // },
    filename: function(req, file, cb) {
        cb(null, file.originalname + '-' + 'vblog' + '-' + Date.now() + '.png')
    }
})
const upload = multer({
    storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a image format: .jpg, .jpeg, .png'))
        }
        return cb(undefined, true)
    }
})

module.exports = upload