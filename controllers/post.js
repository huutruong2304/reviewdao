const express = require('express')
const Post = require('../src/models/post')
    // const multer = require('multer')
const validateStoreMiddleware = require('../src/middleware/storePost')
const auth = require('../src/middleware/auth')
const upload = require('../src/utils/multer')
const cloudinary = require('cloudinary').v2
const formatDate = require('../public/js/datetime')
const Category = require('../src/models/category')


const router = new express.Router()


//phần này chỉ có admin mới thao tác được
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
    const posts = await Post.find({ author: req.session.loginInfo.id }).sort({ updatedAt: -1 })
    console.log(req.session.loginInfo)

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

// lấy posts cho 1 danh mục
router.get('/danhmuc/:category', async(req, res) => {
    // const posts = await Post.find({ category: category.id })
    const category = await Category.findOne({ link: req.params.category })

    const curPage = req.query.pageNumber ? parseInt(req.query.pageNumber) : 1
    const amountPage = Math.ceil(await Post.countDocuments({ category: category.id }) / 10)
        // console.log(amountPage)
        // const length = await Post.find({ category: category.id })
        // console.log(length)
    const posts = await Post.find({ category: category.id }).sort({ updatedAt: -1 }).limit(10).skip(10 * (curPage - 1))
        // posts.dateTime = formatDate(posts.createdAt)
    posts.forEach(x => {
        x.datetime = formatDate(x.updatedAt)
    })

    const pagination = {
        curPage,
        amountPage
    }

    try {
        res.status(200).render('post-category', {
            name: process.env.WS_NAME,
            title: category.name.toUpperCase(),
            category: category.link,
            posts,
            pagination,
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
        //format ngày
    post.dateTime = formatDate(post.createdAt)
        // khi router này được gọi thì cộng thêm 1 lượt view
    post.views = post.views + 1

    try {
        await post.save()
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
    // console.log(req.body)
    if (req.file) {
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
                console.log(newPost)
                try {
                    await newPost.save()
                    res.status(200).redirect('/post/' + newPost._id)
                } catch (error) {
                    console.log(error)
                    res.status(404).redirect('/404')
                }
            }
        )
    } else {
        const newPost = new Post({
                ...req.body,
                postBG: "https://res.cloudinary.com/nran-234/image/upload/v1575294118/reviewdao/image-bg-if-null.jpg",
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

router.post('/post/comments/:id', async(req, res) => {
    let params = req.params.id

    let newCmt = {
        username: req.body.username,
        email: req.body.email,
        content: req.body.content,
        first: true
    }
    let post = await Post.findById(req.params.id)
    let index = post.comments.push({})

    // let maxIndex = post.comments.length - 1
    post.comments[index - 1].comment.push(newCmt)
        // console.log(post.comments[maxIndex].comment)
        // console.log(post)
        // console.log(post.comments[0])
    try {
        post.save()
        res.redirect('/post/' + params)
    } catch (error) {
        console.log(error)
        res.redirect('/404')
    }

})

router.post('/post/comments/comment/replies/:id', async(req, res) => {
    // console.log(req.params.id)
    let params = req.params.id.split('_')
        // console.log(params)
    let newReply = {
        username: req.body.username,
        email: req.body.email,
        content: req.body.content,
        first: false
    }
    let commentList = await Post.findById(params[0]).select('comments')
    commentList = commentList.comments.map(cmts => {
        let isIDCmt = cmts.id === params[1]
            // console.log(isIDCmt)
        if (isIDCmt) {
            cmts.comment.push(newReply)
        }
        return cmts
            // console.log(cmts.comment)
    })

    let post = await Post.findById(params[0])
    post.comments = commentList

    try {
        await post.save()
        res.redirect('/post/' + params[0])
    } catch (error) {
        console.log(error)
        res.redirect('/404')
    }

    // console.log(commentList)

})






module.exports = router