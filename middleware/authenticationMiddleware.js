function authenticationMiddleware() {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('api/v1')
    }
}

module.exports = authenticationMiddleware;
