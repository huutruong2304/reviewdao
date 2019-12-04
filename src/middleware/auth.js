const auth = (req, res, next) => {
    try {
        // console.log(req.session.passport.user)
        if (!req.isAuthenticated()) {
            console.log('auth fail!')
            return res.redirect('/user/login') //nhớ return 
        }
        console.log('auth success!')
        next()
    } catch (error) {
        res.status(404).redirect('/404')
    }
}


module.exports = auth