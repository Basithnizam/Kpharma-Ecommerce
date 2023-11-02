
module.exports ={
    adminAuth:(req,res,next)=>{
        if(req.session.admin){
            console.log("Admin is Alive...")
            

            next();
        }else{
            console.log("Admin is Dead...")
            res.redirect('/admin/login')
            // next('route')
        }
    },
    userAuth:(req,res,next)=>{
        if(req.session.user){
            console.log("User is Alive...")
            next();
        }else{
            console.log("User is Dead...")
            res.redirect('/login')
        }
    }

}