const express = require('express')
const mongoose = require('mongoose')
const Post = require('../src/models/post')
const multer = require('multer')
const validateStoreMiddleware = require('../src/middleware/storePost')
const auth = require('../src/middleware/auth')
const upload = require('../src/utils/multer')
const cloudinary = require('cloudinary').v2
const formatDate = require('../public/js/datetime')

const router = new express.Router()

// lấy trang tạo mới bài viết
router.get('/post/new', auth, (req, res) => {
    res.render('createPost', {
        name: process.env.WS_NAME,
        title: 'Create new post',
        loginInfo: req.session.loginInfo
    })
})

//lấy toàn bộ bài viết của 1 author
router.get('/post/my-articles', auth, async(req, res) => {
    var posts = await Post.find({ author: req.session.loginInfo.id }).sort({ updatedAt: -1 })

    try {
        res.status(200).render('my-articles', {
            name: process.env.WS_NAME,
            title: 'My articles',
            posts,
            loginInfo: req.session.loginInfo
        })
    } catch (error) {
        res.status(404).redirect('/404')
    }
})



//router lấy post cu thể
router.get('/post/:id', async(req, res) => {
    const post = await Post.findById(req.params.id).populate('author')
        // console.log(formatDate(post.createdAt))
    post.dateTime = formatDate(post.updatedAt)

    try {
        res.status(200).render('post', {
            name: process.env.WS_NAME,
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
                res.status(404).redirect('/404')
            }
        }
    )
})

//xóa post của mình
router.delete('/post/delete/:id', auth, async(req, res) => {
    try {
        const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.session.loginInfo.id })

        if (!post) {
            return res.status(404).redirect('/404')
        }
        return res.status(200).send('OK!')
    } catch (error) {
        throw new Error("Can't delete it.")
    }
})


module.exports = router