var express = require('express');
var router = express.Router();

const adminFn = require("../app/controller/admin.js")

//admin password is Admin@123

router.route('/login')
.get(adminFn.viewAdminLogin)
.post(adminFn.adminLogin)


/* GET home page. */
router.get('/', function(req, res, next) {
  // res.send('hello, I am the Admin')
  res.redirect('/admin/login');
});

module.exports = router;
