const Admin = require('../model/adminSchema')
const category = require('../model/categorySchema')
const bcrypt = require('bcrypt');
const productImage = require('../model/productSchema');
const product = require('../model/productSchema');
const user = require('../model/userSchema');

module.exports = {
    //GET admin login

    // ================AdminLOGIN===========
    viewAdminLogin:(req,res)=>{
        try {
            if(req.session.admin){
                res.redirect('/admin')
            }else{
                res.render('adminLogin')
            }
            
        
            
        } catch (error) {
            console.error(error);
            
        }
        
    },
    //POST admin login
    adminLogin:async(req,res)=>{
        const ADMIN  = await Admin.findOne({ Email: req.body.Email });
        console.log('Admin',ADMIN);
        const isPasswordValid = await bcrypt.compare(req.body.Password,ADMIN.Password );
        if(isPasswordValid){
            req.session.admin = ADMIN.Email;
            console.log('session:',req.session.admin);
            res.redirect('/admin')
            
        }else{
            res.send('you have entered wrong credentials')
        }
        
    },
    // ===================ADMIN HOME ==============
    viewAdminHome:(req,res)=>{
        console.log('In viewAdminHome');

        res.render('adminHome')

    },
    // ================PRODUCT=========================

    viewProductList:async(req,res)=>{
        try {
            const products = await product.find({})
            .populate('category','category')
             res.render('adminProductList',{products})
            
            
      
        } catch (error) {
            console.error('error: ',error);
            
        }
        
        

    },
    viewAddProduct:async(req,res)=>{

        console.log('In "addCategory"');

        const data = await category.find({}).sort({ category: 1 })
        res.render('adminAddProduct',{data});
    },
    addProduct:(req,res)=>{
        try {console.log('req.body:',req.body);
        console.log('req.file:',req.file);
        console.log('The name of the file stored is :',req.file.filename);
        req.body.productImage = req.file.filename

        const newProduct = new productImage(req.body)
        newProduct.save().then(()=>{
            res.redirect('/admin/product')
        })



        
            
        } catch (error) {
            console.error(error);
            
        }
       
    },
    deleteProduct :async (req,res)=>{
        const productId = req.params.id;
        console.log('pharams.req.id: ',productId)

        res.send('PRODUCT DELETE PAGE UNDER CONSTRUCTION')

        // const deleteProduct = await category.findByIdAndRemove(catId);
        // console.log(deleteProduct)

        // res.redirect('/admin/category')

    },
    editProduct:(req,res)=>{
        const productId = req.params.id;
        console.log('pharams.req.id: ',productId)

        res.send('PRODUCT EDIT PAGE UNDER CONSTRUCTION')

    },
    viewProductLandign:(req,res)=>{
        const productId = req.params.id;
        console.log('pharams.req.id: ',productId)

        res.send('PRODUCT LANDING  PAGE UNDER CONSTRUCTION')

    },
    // ==================CATEGORY===================

    viewCategoryPage:async(req, res)=> {
        const data = await category.find({}).sort({ category: 1 })
        res.render('adminCategoryPage',{data});

        
    },
    viewAddCategory:(req,res)=>{
        console.log('In /addProduct');
        res.render('adminAddCategory')
    },
    addCategory: (req,res)=>{
        console.log('in add category post method')
        const newCategory = new category(
            req.body
        );
         newCategory.save()
        .then(() => {
            res.redirect('/admin/category')
            console.log('category created')
        })
        .catch((error) => {
            console.error("error in saving  the category:",error);
            
        });
        
    },
    editCategory: async(req,res)=>{
        const catId = req.params.id;


        console.log('pharams',catId)
        const categories = await category.findOne({_id:catId})
        console.log(categories)
        res.render('adminEditCategory',{categories})
    },
    updateCategroy:async(req,res)=>{
        const catId = req.params.id;
        
        const newCategory = req.body.category 
        const exCategory = await category.findOne({ "category": newCategory})
        
        console.log('exsisting catergory:',exCategory)
    
        if (exCategory && exCategory._id.toString()  !== catId){

            req.flash('error', 'This is an error message.');

            res.render('adminEditCategory',{newCategory,catId,categories:""})
        }else{
           await category.updateOne({_id:catId},{"category": newCategory})
            res.redirect('/admin/category')
        }
        
       
    },
    deleteCategory:async (req,res)=>{
        try {
            const catId = req.params.id;
            console.log( 'categoryId',catId)

            const deleteCategory = await category.findByIdAndRemove(catId);
            console.log('Deleted Category: ',deleteCategory)
            res.redirect('/admin/category')
            
        } catch (error) {
            console.error('error',error)
            
        }
        
        

    },


    // ===================USERS======================
    viewUserList: async(req,res)=>{
        const users = await user.find({})

        res.render('adminUserList',{users})

    },
    
    // =============LOGOUT============= 
    logoutadmin: (req, res) => {
        try {
            console.log(`Before nulling : req.session.user is ${req.session.admin}`)
            console.log(`Before nulling : req.session is ${req.session}`)

            // req.session.user = null
            req.session.admin= null;

            console.log(`After nulling : req.session is ${req.session}`)
            

            res.redirect('/admin')
        } catch (error) {
            console.error('Hitted catch: error : ',error)
        }
        

    }
    
}