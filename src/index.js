const express = require('express')
const hbs = require('hbs')
const path = require('path')
const bodyParser = require('body-parser')
const passport = require('passport')
const flash = require('connect-flash')

// const session = require('express-session')
const passportConfig = require('./utils/passport')
const sessionConfig = require('./utils/session')

const routerPost = require('../controllers/post')
const routerBasic = require('../controllers/basic')
const routerUser = require('../controllers/user')

//connect to DB
require('./db/mongoose')

const app = express()
const port = process.env.PORT

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//define paths
const publicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// setup express
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
app.use(express.static(publicPath))
    //đã khai báo session
app.use(sessionConfig)
app.use(flash())
    //khởi tạo passport
app.use(passport.initialize())
app.use(passport.session())
passportConfig(passport)

// use router post
app.use(routerBasic)
app.use(routerUser(passport))
app.use(routerPost)


app.listen(port, () => {
    console.log('Server is up to port ' + port)
})