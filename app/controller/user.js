const  user  = require('../model/userSchema')
// const mongoose = require('mongoose');


function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

module.exports = {
    viewSignUp: (req, res) => {
        res.render('signUp')
        
    },
    signInUser: async (req, res) => {
        try {const userExistsEmail = await user.findOne({ email: req.body.email });
        const userExistsPhone = await user.findOne({ phone: req.body.phone });
        if (userExistsEmail) {
            res.send("User already exists with this email" )
        }
        else if (userExistsPhone) {
            res.send("User already exists with this phone no." )
        } else {
            try {
                // Generate and send OTP
                const otp = generateOTP();
                // const number = req.body.phone
                // await sendOTP(number, otp);

                // Store OTP and user input data in session
                // req.session.otp = otp;
                // req.session.userData = req.body;

                // Redirect to OTP verification page
                console.log('OTP: ', otp)
                console.log('user data: ', req.body)
                res.redirect('/otpVerify')
            } catch (err) {
                console.error(err);
            }
        }
    }  catch (error) {
        console.log('the error occured during signup:',error)
            
        }
    },
    otpVerify:(req,res)=>{res.send('Welcome to OTP verification page')

    }
}


