const express = require('express')
const Category = require('../src/models/category')
const bodau = require('../src/utils/bodau')


const router = new express.Router()

router.get('/category', async(req, res) => {
    const category = await Category.find()
    try {
        res.send(category)
    } catch (error) {
        console.log(error)
        res.status(404).redirect('/404')
    }
})

router.post('/category', async(req, res) => {
    const category = await new Category({
        name: req.body.name.toLowerCase()
    })
    category.link = bodau(category.name).replace(/ /g, '-')

    await category.save()
    console.log(category.link)
    res.send(category)
})




module.exports = router