const express = require('express')
const mongoose = require('mongoose')
const Post = require('../src/models/post')
const multer = require('multer')
const validateStoreMiddleware = require('../src/middleware/storePost')
const auth = require('../src/middleware/auth')
const cloudinary = require('cloudinary').v2

const router = new express.Router()



// config image upload
const storage = multer.diskStorage({
    // destination: function(req, file, cb) {
    //     cb(null, 'public/img/postImages')
    // },
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



// lấy trang tạo mới bài viết
router.get('/post/new', auth, (req, res) => {
    res.render('createPost', {
        title: 'Create new post',
        loginInfo: req.session.loginInfo
    })
})

//lấy toàn bộ bài viết của 1 author
router.get('/post/my-articles', auth, async(req, res) => {
    const allPost = await Post.find({ author: req.session.loginInfo.id })

    try {
        res.status(200).render('my-articles', {
            title: 'My articles',
            allPost,
            loginInfo: req.session.loginInfo
        })
    } catch (error) {
        res.status(404).redirect('/404')
    }
})

//router lấy post cu thể
router.get('/post/:id', async(req, res) => {
    const post = await Post.findById(req.params.id).populate('author')

    try {
        res.status(200).render('post', {
            title: post.title.substr(0, 26) + '...',
            post,
            loginInfo: req.session.loginInfo
        })
    } catch (error) {
        res.status(404).redirect('/404')
    }

})



// trên route thì nó sẽ chạy từ trái qua phải. cái nào để trước thì chạy trước, cái nào để sau thì chạy sau
router.post('/post/store', auth, upload.single('postBG'), validateStoreMiddleware, async(req, res) => {
    // const postBG = await sharp(req.file.filename).resize({ width: 1000, height: 600 }).png()
    // hiển thị background-image trong file createpost.hbs
    //đang xử lí lưu ảnh và set ảnh nền
    // create new post
    // console.log(req.session.loginInfo.id)
    // console.log(req.file)

    await cloudinary.uploader.upload(req.file.path, { public_id: "reviewdao/" + req.session.loginInfo.id + "/my_name" },
        async(error, result) => {
            if (error) {
                console.log(error)
                res.status(404).redirect('/404')
            }
            const newPost = new Post({
                    ...req.body,
                    postBG: result.secure_url,
                    author: req.session.loginInfo.id
                })
                // console.log(newPost)
            try {
                await newPost.save()
                res.status(200).redirect('/post/' + newPost._id)
            } catch (error) {
                console.log(error)
                res.status(404).redirect('/404')
            }
        })

})

module.exports = router