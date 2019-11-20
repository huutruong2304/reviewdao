const express = require('express')
const Post = require('../models/post')

const router = new express.Router()

router.get('/', async(req, res) => {

    const posts = await Post.find()
    res.render('index', {
        title: 'V-blog - Home',
        posts
    })
})
router.get('/about', (req, res) => {
    res.render('about', {
        title: 'V-blog - About'
    })
})
router.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'V-blog - Contact'
    })
})

router.get('/404', (req, res) => {
    res.status(404).render('notfound-404', {
        title: 'V-blog - 404 Not found'
    })
})


module.exports = router