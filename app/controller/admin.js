const Admin = require('../model/adminSchema')
const bcrypt = require('bcrypt');

module.exports = {
    viewAdminLogin:(req,res)=>{
        // console.log('reached to render admin login')
        res.render('adminLogin')
    },
    adminLogin:async(req,res)=>{
        const ADMIN  = await Admin.findOne({ Email: req.body.Email });
        console.log('Admin',ADMIN);
        const isPasswordValid = await bcrypt.compare(req.body.Password,ADMIN.Password );
        if(isPasswordValid){
            req.session.admin = ADMIN.Email;
            console.log('session:',req.session.admin);
            res.send('Admin logined sucessfully with session')
            
        }else{
            res.send('you have entered wrong credentials')
        }
        
    }
}