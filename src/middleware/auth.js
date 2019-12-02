const auth = (req, res, next) => {
    try {
        // console.log(req.session.passport.user)
        if (!req.isAuthenticated()) {
            return res.redirect('/user/login') //nhớ return 
        }
        next()
    } catch (error) {
        res.status(404).redirect('/404')
    }
}


module.exports = auth