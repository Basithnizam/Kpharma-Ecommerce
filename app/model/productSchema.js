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
        required: true },

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

const product = mongoose.model('products', productSchema);

module.exports = product;