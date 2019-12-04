const express = require('express')
const User = require('../src/models/user')
const auth = require('../src/middleware/auth')


module.exports = (passport) => {
    const router = new express.Router()



    router.get('/admin', (req, res) => {
        res.redirect('/user/login')
    })

    //lấy trang đăng kí tài khoản
    // router.get('/user/signup', (req, res) => {
    //     try {
    //         res.status(200).render('signup', {
    //             title: 'Sign up',
    //             message: req.flash('message')
    //         })
    //     } catch (error) {
    //         res.redirect('/404')

    //     }
    // })

    //post đang kí
    // router.post('/auth/signup', passport.authenticate('signup', {
    //     failureRedirect: '/user/signup',
    //     successRedirect: '/user/me',
    //     failureFlash: true

    // }))

    // lấy trang đăng nhập
    router.get('/user/login', async(req, res) => {
        try {
            res.status(200).render('login', {
                name: process.env.WS_NAME,
                title: 'Login',
                message: req.flash('message')
            })
        } catch (error) {
            res.redirect('/404')
        }
    })

    // post login
    router.post('/auth/login', passport.authenticate('login', {
        failureRedirect: '/user/login',
        successRedirect: '/user/me',
        failureFlash: true
    }))

    //log out
    router.get('/user/signout', (req, res) => {
        req.logout()
        req.session.loginInfo = {}
        res.redirect('/user/login')
    })

    //lấy trang thông tin cá nhân của từng id
    router.get('/user/me', auth, async(req, res) => {

        console.log(req.session.passport.user)
        const me = await User.findById(req.session.passport.user)

        req.session.loginInfo = {
            id: me._id,
            username: me.username
        }

        // console.log(req.session.loginInfo)
        res.status(200).render('me', {
            name: process.env.WS_NAME,
            title: 'About me',
            user: {
                username: me.username,
                email: me.email
            },
            loginInfo: req.session.loginInfo
        })
    })



    // trả về giá trị router
    return router
}