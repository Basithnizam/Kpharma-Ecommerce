var express = require('express');
var router = express.Router();
const userFn = require("../app/controller/user.js")



router.route('/signUp')
.get(userFn.viewSignUp)
.post(userFn.signInUser);

router.route('/otpVerify')
.get(userFn.otpVerify)



router.get('/',(req, res) =>{
  
  res.redirect('/signUp');
});

module.exports = router;


