var express = require('express');
var router = express.Router();
const userFn = require("../app/controller/user.js")



router.route('/signUp')
.get(userFn.viewSignUp)
.post(userFn.signInUser);

// User Login Get Request
router.route('/login')
.get(userFn.viewLoginInPage)
.post(userFn.userLogin)

router.route('/otpVerify')
.get(userFn.otpVerify)
.post(userFn.otpVerification)

router.route('/logout')
.get(userFn.logoutUser)


router.route('/addAdmin')
//To add admin with encrypted password
// .get(userFn.addAdmin)    




//default root
router.get('/',(req, res) =>{
  
  res.redirect('/login');
});

module.exports = router;


