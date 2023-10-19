const mongoose = require('mongoose');
const Schema = mongoose.Schema;




const userSchema = new Schema({
    name: String,
    email:String,
    phone:Number ,
    password:String,
    address: [{
        address1: {
            city: String,
            houseName:String,
            locality:String,
            number:Number,
            pin:Number,
            state:String,
        },
    }],
    blocked: Boolean,
    profilePic:String ,
    walletId:String 
    // created_at: { type: String, default: () => { return moment(new Date()).format('DD/MM/YYYY') }}
});

const user = mongoose.model('USERS', userSchema);

module.exports = user


