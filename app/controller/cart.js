const cart = require('../model/cartSchema');


module.exports = {
    viewCart:(req,res)=>{
        res.render('userCart')
    }
}