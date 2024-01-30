const mongoose = require('mongoose');
const moment = require('moment');
const { Schema, ObjectId } = mongoose;

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    category: { 
        type: Schema.Types.ObjectId, 
        ref: 'category',
        required: true 
    },
    productMrp:{
        type: Number,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    inStock: { 
        type: Number, 
        required: true 
    },
    
    productImage: {
        type: String,
        
        required: true
    },
    
    created_at: { 
        type: String, default: () => { return moment(new Date()).format('DD/MM/YYYY') } 
    },
})
productSchema.pre('validate', function(next) {
    if (this.productMrp < this.productPrice) {
        const error = new Error('productMrp must be greater than or equal to productPrice');
        return next(error);
    }
    next();
});

const product = mongoose.model('products', productSchema);

module.exports = product;