var express = require('express');
var router = express.Router();
const multer  = require('multer')
const nocache = require("nocache");



var sessionFn = require('../middleware/sessionAuth')

const adminFn = require("../app/controller/admin.js")//  importing admin controller

const config = require('../configuration/multer'); // importing multer file path and file name config to use as middle ware
const category = require('../app/model/categorySchema');

//admin password is Admin@123



//multerconfig






// ____adminLoginPage___
router.route('/login')
.get(nocache(),adminFn.viewAdminLogin)
.post(adminFn.adminLogin)

router.use(sessionFn.adminAuth) //auth middle ware


// -------ADMINHOME--------
router.route('/')
.get(adminFn.viewAdminHome)

// ---------PRODUCT----------
router.route('/product')
.get(adminFn.viewProductList)

router.route('/addProduct')
.get(adminFn.viewAddProduct)
.post(config.upload.single('productImage'),adminFn.addProduct)

router.route('/deleteProduct/:id')
.get(adminFn.deleteProduct)

router.route('/editProduct/:id')
.get(adminFn.editProduct)

router.route('/viewProduct/:id')
.get(adminFn.editProduct)






// ----------CATEGORY----------

router.route('/category')
.get(adminFn.viewCategoryPage)


router.route('/addCategory')
.get(adminFn.viewAddCategory)
.post(adminFn.addCategory)

router.route('/deleteCategory/:id')
.get(adminFn.deleteCategory) 

router.route('/editCategory/:id')
.get(adminFn.editCategory)
.post(adminFn.updateCategroy)

// --------USERS-------
router.route('/user')
.get(adminFn.viewUserList)



router.route('/logout')
.get(adminFn.logoutadmin)


/* GET home page. */
// router.get('/', function(req, res, next) {
//   // res.send('hello, I am the Admin')
//   res.redirect('/admin/login');
// });

module.exports = router;
