const express = require('express')
const mongoose = require('mongoose')
const Post = require('../models/post')
const sharp = require('sharp')
const multer = require('multer')
const validateStoreMiddleware = require('../middleware/storePost')


const router = new express.Router()


// config image upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/img/postImages')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + 'vblog' + '-' + Date.now() + '.png')
    }
})
const upload = multer({
    // dest: 'public/img/postImages',
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




router.get('/post/new', (req, res) => {
    res.render('createPost', {
        title: 'V-blog - Create new post'
    })
})

// //middle cho việc lấy post cụ thể
// const validateGetIDMiddleware = (req,res,r)

//router lấy post cu thể
router.get('/post/:id', async(req, res) => {
    const post = await Post.findById(req.params.id)

    try {
        res.status(200).render('post', {
            title: 'V-blog - ' + post.title.substr(0, 16) + '...',
            post
        })
    } catch (error) {
        res.status(404).send(error)
    }

})



//router creating new post
router.post('/post/store', validateStoreMiddleware, upload.single('postBG'), async(req, res) => {
    // const postBG = await sharp(req.file.filename).resize({ width: 1000, height: 600 }).png()
    // hiển thị background-image trong file createpost.hbs
    //đang xử lí lưu ảnh và set ảnh nền
    // create new post
    const newPost = new Post({...req.body, postBG: req.file.filename })
    console.log(req.file)
    try {
        await newPost.save()
        res.status(200).redirect('/')
    } catch (error) {
        res.status(400).send(error)
    }
})


router.post('/test', (req, res) => {
    res.send(req.body.email)
    console.log(req.body)
})

module.exports = router