const Admin = require('../model/adminSchema')
const category = require('../model/categorySchema')
const bcrypt = require('bcrypt');
const productImage = require('../model/productSchema');
const product = require('../model/productSchema');
const user = require('../model/userSchema');

module.exports = {
    //GET admin login

    // ================AdminLOGIN===========
    viewAdminLogin: (req, res) => {
        try {
            if (req.session.admin) {
                res.redirect('/admin')
            } else {
                res.render('adminLogin', {
                    passwordError: req.flash('passwordError'),
                    databaseError: req.flash('databaseError'),
                    emailError: req.flash('emailError')
                })
            }



        } catch (error) {
            console.error(error);
            res.redirect('/admin')


        }

    },
    //POST admin login
    adminLogin: async (req, res) => {
        try {

            const ADMIN = await Admin.findOne({ Email: req.body.Email });
            if (ADMIN) {
                const isPasswordValid = await bcrypt.compare(req.body.Password, ADMIN.Password);
                if (isPasswordValid) {
                    req.session.admin = ADMIN;
                    res.redirect('/admin')

                }
                else {
                    req.flash('passwordError', 'Invalid Password')
                    res.redirect('/admin')

                }


            } else {
                req.flash('emailError', 'You are not an admin')
                res.redirect('/admin')
            }

        } catch (error) {

        }
    },

    // ===================ADMIN HOME ==============
    viewAdminHome: (req, res) => {
        console.log('In viewAdminHome');
        console.log('Admins req.sessionID', req.sessionID)

        res.render('adminHome', { databaseError: req.flash('block-error'), })

    },
    // ================PRODUCT=========================

    viewProductList: async (req, res) => {
        try {
            const products = await product.find({})
                .populate('category', 'category').sort({ productName: 1 })

            try {
                const data = await category.find({}).sort({ category: 1 })
                
                res.render('adminProductList', {
                    products,
                    data,
                    productUpadate: req.flash('productUpadate'),
                    productUpdateError: req.flash('productUpdateError')
                })
            } catch (error) {
                console.error('There is an error in fetching category', error)
                req.flash('databaseError')

            }









        } catch (error) {
            console.error('error: ', error);

        }



    },
    viewAddProduct: async (req, res) => {

        console.log('In "addCategory"');

        const data = await category.find({}).sort({productName: 1})
        // res.render('adminAddProduct', {data,});
        res.render('adminAddProductmultiple', {data,});//testing
       
    },
    addProduct: (req, res) => {
        try {
            if(req.file){
                req.body.productImage = req.file.filename
            }
            const newProduct = new productImage(req.body)
            newProduct.save()
                .then(() => {
                    res.status(200).json({ success: 'The Product Is Added successfully' })
                })
                .catch(error => {
                    console.log('Error: ', error)
                    res.status(200).json({ error: 'Error! Try Again later' })
                })
            } catch (error) {
            console.error(error);

        }

    },
    deleteProduct: async (req, res) => {
        const productId = req.params.id;
        console.log('pharams.req.id: ', productId)



        const deleteProduct = await product.findByIdAndRemove(productId);
        console.log(deleteProduct)

        res.redirect('/admin/product')

    },
    editProduct: async (req, res) => {
        const productId = req.params.id;
        

        const updateProduct = await product.findById(productId)
            .populate('category', 'category')
        const data = await category.find({}).sort({ category: 1 })
        

        res.render('adminUpdateProduct', { updateProduct, data })
        

    },
    updateProduct: async (req, res) => {
        try {

            const productId = req.params.id

            console.log('ProductId : ', productId);
            console.log('req.body:', req.body)

            if (req.file) {
                req.body.productImage = req.file.filename
            }
            try {
                
            } catch (error) {
                
            }

            const updatedProduct = product.findByIdAndUpdate(productId, req.body)
            .then(() => {
                res.status(200).json({success: 'Product is Successfully Updated'})
            }).catch((error) => {
                console.log('Error:',error)
                res.status(200).json({error:'Error!, Try again later'})
            })


        } catch (error) {
            console.error('Error: ', error)

        }
    },
    viewProductLanding: (req, res) => {
        const productId = req.params.id;
        console.log('pharams.req.id: ', productId)

        res.send('PRODUCT LANDING  PAGE UNDER CONSTRUCTION')

    },
    // ==================CATEGORY===================

    viewCategoryPage: async (req, res) => {
        const data = await category.find({}).sort({ category: 1 })
        res.render('adminCategoryPage', { data });


    },
    viewAddCategory: (req, res) => {
        console.log('In /addProduct');
        res.render('adminAddCategory')
    },
    addCategory: async (req, res) => {
        try {
            console.log('req.body', req.body)
            console.log('req.file', req.file)
            let Name = req.body.category
            const categories = await category.findOne({ category: Name })
            if (req.file) {
                req.body.categoryImage = req.file.filename;
                console.log('Received Image:', req.body);

            }

            if (categories) {
                console.log('there is a categroy')
                res.status(250).json({ error: 'CATEGORY NAME ALREADY EXISTS' })
            } else {
                try {
                    const newCategory = new category(
                        req.body
                    );
                    newCategory.save()
                        .then(() => {
                            res.status(200).json({ sucess: 'hello' })
                            console.log('category created')
                        })
                        .catch((error) => {

                            console.error("error in saving  the category:", error);
                            res.status(500)
                        });

                } catch (error) {
                    console.log('Error: ', error)
                    res.status(500).json({ error: 'Internal Server Error' });
                }

            }

        } catch (error) {
            console.log('Error: ', error)
            res.status(500).json({ error: 'Internal Server Error' });
        }


    },
    editCategory: async (req, res) => {
        const catId = req.params.id;



        const categories = await category.findOne({ _id: catId })
        console.log(categories)
        res.render('adminEditCategory', { categories })
    },
    updateCategroy: async (req, res) => {
        const catId = req.params.id;


        const newCategory = req.body.category
        const exCategory = await category.findOne({ "category": newCategory })

        console.log('exsisting catergory:', exCategory)

        if (exCategory && exCategory._id.toString() !== catId) {

            console.log('there is a categroy')
            res.status(250).json({ error: 'CATEGORY NAME ALREADY EXISTS' })
        } else {
            if (req.file) {
                req.body.categoryImage = req.file.filename;
            }
            let update = req.body
            await category.updateOne({ _id: catId }, update, { upsert: true })
                .then(() => {
                    res.status(200).json({ sucess: 'hello' })
                    console.log('category created')
                })

        }


    },
    deleteCategory: async (req, res) => {
        try {
            const catId = req.params.id;
            console.log('categoryId', catId)

            const deleteCategory = await category.findByIdAndRemove(catId);
            console.log('Deleted Category: ', deleteCategory)
            res.redirect('/admin/category')

        } catch (error) {
            console.error('error', error)

        }



    },


    // ===================USERS======================
    viewUserList: async (req, res) => {
        try {
            const users = await user.find({}).sort({ name: 1 })

            res.render('adminUserList', {
                users,
                blockerror: req.flash('block-error'),
            })

        } catch (error) {
            req.flash("block-error", 'Error in updating the User Status')
            res.redirect('/admin')

        }


    },
    blockUser: async (req, res) => {
        try {

            const userId = req.params.id;
            
            const sessionIds = Object.keys(req.sessionStore.sessions);
            const sessionId = sessionIds.find(id => {
                const sessionData = JSON.parse(req.sessionStore.sessions[id]);
                return sessionData.user && sessionData.user._id === userId;
            });



            const userStatus = await user.findOne({ _id: userId })
            let status = userStatus.blocked
            status ? (status = false) : (status = true)
            try {
                await user.updateOne({ _id: userId }, { blocked: status })
                .then(()=>{
                    if(status){
                        if (sessionId) {
                    

                            req.sessionStore.destroy(sessionId, (err) => {
                              if (err) {
                                console.error('Error destroying session:', err);
                              } else {
                                console.log('Session destroyed successfully.');
                              }
                            });
                          } else {
                            console.log('User is not logined ');
                          }
                          
    
                    }
                    res.redirect('/admin/user')
                })
                    


                
            } catch (error) {

                console.error('Error in Updating', error)
                req.flash("block-error", 'Error in updating the User Status')
                res.redirect('/admin/user')


            }


        } catch (error) {
            console.error(error);
            req.flash("block-error", 'Error in updating the User Status')
            res.redirect('/admin/user')

        }


        // res.send('You are going to block this user')
    },
    testcat: (req, res) => {
        res.render('adminAddCategory1')
    },
    addCategory1: (req, res) => {

        // If an image is included, you can access it in req.file
        if (req.file) {
            req.body.categoryImage = req.file.filename;
            console.log('Received Image:', req.file.filename);
        }
        console.log('Received FormData:', req.body);
        res.status(200).json({ message: 'Form data received successfully' })
    },

    // =============LOGOUT============= 
    logoutadmin: (req, res) => {
        try {
            console.log(`Before nulling : req.session.user is ${req.session.admin}`)
            console.log(`Before nulling : req.session is ${req.session}`)

            // req.session.user = null
            req.session.admin = null;

            console.log(`After nulling : req.session is ${req.session}`)


            res.redirect('/admin')
        } catch (error) {
            console.error('Hitted catch: error : ', error)
        }


    }

}