const session = require('express-session')

module.exports = session({
    secret: 'vannhi',
    resave: false,
    saveUninitialized: true
})