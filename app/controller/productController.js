const product = require('../model/productSchema');


module.exports = {
    searchProduct:(req,res)=>{
        console.log('req.query: '+req.query);
        res.render('productSearch')
    }
}