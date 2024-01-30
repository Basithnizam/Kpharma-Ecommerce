const mongoose = require('mongoose');
const moment = require('moment');

const categorySchema = new mongoose.Schema({
    category:{
        type:String,
        required:true,
        uppercase:true,
        unique:true
    },
    catDescirption:{
        type:String,
        required:true,

    },
    categoryImage:{
        type:String,
        required:true,
        unique:true
    },
    created_at: { 
        type: String, 
        default: () => { return moment(new Date()).format('DD/MM/YYYY') }
    }
})

const category = mongoose.model('category',categorySchema);

module.exports=category;