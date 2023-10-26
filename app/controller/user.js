const  user  = require('../model/userSchema')  // const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

// Function to send OTP via Twilio
async function sendOTP(phone, otp) {
    const accountSid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_ACCESS_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    const message = `Your FoodWo verification OTP(One-Time-Password) is ${otp}`;

    await client.messages.create({
        body: message,
        from: '+19066296777',
        to: phone
    });
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
                const number = "+91" + req.body.phone;

                 
                await sendOTP(number, otp);

                // Store OTP and user input data in session
                req.session.otp = otp;
                // req.session.userData = req.body;
                req.session.userData = req.body;

                // Redirect to OTP verification page
                console.log('OTP: ', req.session.otp)
                console.log('user data: ', req.session.userData )
                res.redirect('/otpVerify')
            } catch (err) {
                console.error(err);
            }
        }
    }  catch (error) {
        console.log('the error occured during signup:',error)
            
        }
    },
    //load OTP entering page
    otpVerify:(req,res)=>{
        let mobileNumber = req.session.userData.phone
        res.render('verifyOtp',{mobileNumber ,failed:''})
    },


    // OTP Verification POST Request
     otpVerification:(req, res)=> {
        console.log('Otp comming with the req is : ',req.session.otp)
        console.log('user data comming with the req is : ',req.session.userData)
        const userInputOtp = parseInt(req.body.otp);
        const storedOtp = parseInt(req.session.otp);
        console.log("userInput : " + userInputOtp + " storeotp : " + storedOtp)
        if (userInputOtp === storedOtp) {
        // OTP is valid, retrieve user input data from session
        const userData = req.session.userData;
        console.log("till here")
        if (!userData) {
            return res.status(500).json({ error: "User data not found" });
        }
        console.log("also here");

        // Create the user account
        const password = userData.password
        // const { fullname, email, phone, address, password, baseImage } = userData;
        const hashedPassword = bcrypt.hashSync(password, 10);
        userData.password = hashedPassword

        console.log(userData)


        // Save user data to the database
        const newUser = new user(
            userData
        );

        newUser.save()
            .then(() => {
                // Clear OTP and user data from session
                res.send(`${req.session.userData.name}, you are successfully Signed in `)
                delete req.session.otp;
                delete req.session.userData;
                // res.status(201).json({ success: "Account created" });
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json({ error: "Error creating user account" });
            });
    } else {
        res.render('verifyOtp',{ mobileNumber ,failed: 'Invalid OTP' });
    }
}
}


