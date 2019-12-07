const express = require('express')
const Post = require('../src/models/post')
const formatDate = require('../public/js/datetime')

const router = new express.Router()

//lấy trang chủ
router.get('/', async(req, res) => {
    const curPage = req.query.pageNumber ? parseInt(req.query.pageNumber) : 1
    const amountPage = Math.ceil(await Post.estimatedDocumentCount() / 10)
    const posts = await Post.find().sort({ updatedAt: -1 }).limit(10).skip(10 * (curPage - 1))
        // posts.dateTime = formatDate(posts.createdAt)
    posts.forEach(x => {
        x.datetime = formatDate(x.updatedAt)
    })


    const pagination = {
        curPage,
        amountPage
    }

    try {
        res.render('index', {
            name: process.env.WS_NAME,
            title: 'Trang chuyên review công nghệ',
            loginInfo: req.session.loginInfo,
            posts,
            pagination
        })
    } catch (error) {
        console.log({ error })
        res.status(404).redirect('/404')
    }
})


router.get('/about', (req, res) => {
    res.render('about', {
        name: process.env.WS_NAME,
        title: 'About',
        loginInfo: req.session.loginInfo
    })
})
router.get('/contact', (req, res) => {
    res.render('contact', {
        name: process.env.WS_NAME,
        title: 'Contact',
        loginInfo: req.session.loginInfo
    })
})

router.get('/404', (req, res) => {
    res.status(404).render('notfound-404', {
        name: process.env.WS_NAME,
        title: '404 Not found',
        loginInfo: req.session.sttLogin
    })
})
router.get('/*', (req, res) => {
    res.redirect('/')
})

module.exports = router