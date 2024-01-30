var express = require('express');
var router = express.Router();
const userFn = require("../app/controller/user.js")
const cartFn = require("../app/controller/cart.js")
let sessionFn = require('../middleware/sessionAuth')
const nocache = require("nocache");
let productFn = require("../app/controller/productController.js")



router.route('/signUp')
.get(userFn.viewSignUp)
.post(userFn.signInUser);

// User Login Get Request
router.route('/login')
.get(nocache(),userFn.viewLoginInPage)
.post(userFn.userLogin)

router.route('/otpVerify')
.get(userFn.otpVerify)
.post(userFn.otpVerification)
router.route('/resendOtp')
.get(userFn.resendOtp)

router.route('/logout')
.get(userFn.logoutUser)



router.use(sessionFn.userAuth)

router.route('/product/:id')
.get(userFn.productLandingpage)


// _____________________________________cart__________________________________

router.route('/userCart/:id')
.get(cartFn.viewCart)


router.route('/addToCart/:id')
.get(userFn.addToCart)

// ______________________________search_______________________________

router.route('/search')
.get(productFn.searchProduct)


// ______________________________Profile_______________________________

router.route('/userProfile')
.get(userFn.viewUserProfile)

// ______________________________ORDERS_______________________________


// router.route('/userOder')
// .get(userFn.viewUserOrder)




router.route('/home')
.get(userFn.viewHomePage)




// router.route('/addAdmin')
//To add admin with encrypted password
// .get(userFn.addAdmin)    




//default root
router.get('/',(req, res) =>{
  
  res.redirect('/login');
});

module.exports = router;


