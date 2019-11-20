const express = require('express')
const Post = require('../src/models/post')

const router = new express.Router()

router.get('/', async(req, res) => {
    const posts = await Post.find()
        // console.log(req.session.loginInfo)
    res.render('index', {
        title: 'Trang chuyên review công nghệ',
        loginInfo: req.session.loginInfo,
        posts
    })
})
router.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        loginInfo: req.session.loginInfo
    })
})
router.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contact',
        loginInfo: req.session.loginInfo
    })
})

router.get('/404', (req, res) => {
    res.status(404).render('notfound-404', {
        title: '404 Not found',
        sttLogin: req.session.sttLogin
    })
})


module.exports = router