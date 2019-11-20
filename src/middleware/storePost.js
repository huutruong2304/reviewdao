//middleware creating new post
const validateStoreMiddleware = async(req, res, next) => {

    if (!req.body.title || !req.body.description || !req.body.content || !req.file) {
        return res.redirect('/404')
    }
    next()
}


module.exports = validateStoreMiddleware