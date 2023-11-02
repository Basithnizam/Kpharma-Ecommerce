const mongoose = require('mongoose');
const { Schema, ObjectId } = mongoose;
const moment = require('moment');





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
    walletId:String, 
    signupDate: {
        type: Date,
        default: Date.now, // Set the default value to the current date and time
        
      },
    created_at: { type: String, default: () => { return moment(new Date()).format('DD/MM/YYYY') }}

});

const user = mongoose.model('USERS', userSchema);

module.exports = user


