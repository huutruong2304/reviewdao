const express = require('express')
const User = require('../models/user')


const router = new express.Router()


//router để get register page
router.get('/user/register', (req, res) => {
        try {
            res.status(200).render('register', {
                title: 'V-blog - Register'
            })
        } catch (error) {
            res.redirect('/404')

        }
    })
    // router post dữ liệu vào db
router.post('/auth/register', async(req, res) => {
    // const newUser = new User({...req.body })
    console.log(2)
    console.log(req.body)
        // console.log(newUser)
        // try {
        //     await newUser.save()
        //     res.status(200).redirect('/user/re  gister')
        // } catch (error) {
        //     console.log(error)
        //     res.redirect('/404')
        // }
})


module.exports = router