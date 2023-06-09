function hasUser () {
    return (req,res,next) => {
        if(req.user) {
            next()
        } else {
            res.redirect('/auth/login')
        }
    }
}

module.exports = hasUser