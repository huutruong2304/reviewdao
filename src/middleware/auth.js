const auth = (req, res, next) => {
    try {
        // console.log(req.session.passport.user)
        if (!req.isAuthenticated()) {
            return res.redirect('/404') //nhớ return 
        }
        next()
    } catch (error) {
        res.status(404).redirect('/404')
    }
}


module.exports = auth