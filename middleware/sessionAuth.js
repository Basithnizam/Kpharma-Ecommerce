const user = require('../app/model/userSchema');


module.exports = {
    adminAuth: (req, res, next) => {
        if (req.session.admin) {
            next();
        } else {
            res.redirect('/admin/login')
        }
    },
    userAuth: async (req, res, next) => {
        try {
            if (req.session.user) {
                next();
                
            } else {
                console.log("User is Dead...")
                res.redirect('/login')
            }
        } catch (error) {
            console.error('Error: ', error)

        }
    }
}