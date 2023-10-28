const user = require('../model/userSchema')  // const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// const Admin = require('../model/adminSchema'); Used to add admin for user.js


function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

// Function to send OTP via Twilio
async function sendOTP(phone, otp) {
    const accountSid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_ACCESS_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    const message = `Your Kpharma verification OTP(One-Time-Password) is ${otp}`;

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
        try {
            // const existingData = await user.findOne({ email: 'basithnizam@gmail.com' });
            const userExistsEmail = await user.findOne({ email: req.body.email });
            const userExistsPhone = await user.findOne({ phone: req.body.phone });
            console.log(userExistsEmail)

            // console.log("Input data: ",existingData)
            if (userExistsEmail) {
                res.send("User already exists with this email")
            }
            else if (userExistsPhone) {
                res.send("User already exists with this phone no.")
            }
            else {
                try {
                    // Generate and send OTP
                    const otp = generateOTP();
                    const number = "+917012736703" // for dev only otp set to this number

                    // const number = "+91" + req.body.phone;



                    await sendOTP(number, otp);

                    // Store OTP and user input data in session
                    req.session.otp = otp;
                    // req.session.userData = req.body;
                    req.session.userData = req.body;

                    console.log('OTP: ', req.session.otp)
                    console.log('user data: ', req.session.userData)

                    // Redirect to OTP verification page
                    res.redirect('/otpVerify')
                } catch (err) {
                    console.error(err);
                }
            }
        } catch (error) {
            console.log('the error occured during signup:', error)

        }
    },
    //load OTP entering page
    otpVerify: (req, res) => {
        let mobileNumber = req.session.userData.phone
        res.render('verifyOtp', { mobileNumber, failed: '' })
    },

    //load login page
    viewLoginInPage: (req, res) => {
        res.render('userLogin')
    },


    // OTP Verification POST Request
    otpVerification: (req, res) => {
        console.log('Otp comming with the req is : ', req.session.otp)
        console.log('user data comming with the req is : ', req.session.userData)
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
            res.render('verifyOtp', { mobileNumber, failed: 'Invalid OTP' });
        }
    },
    userLogin: async (req, res) => {

        const USER = await user.findOne({ email: req.body.email });
        if (USER) {
            if (USER.blocked) {
                res.send(" you account is blocked")
            }
            else {
                const isPasswordValid = await bcrypt.compare(req.body.password, USER.password);
                if (isPasswordValid) {
                    req.session.user = USER.name;
                    res.send(`${USER.name}, Welcome to the home page validation and session`)
                    // res.status(201).json({ success: 'logged in.', user: users });
                } else {
                    res.send("you entered a wrong password")
                    // res.status(401).json({ failed: 'wrong password' });
                }
            }
        } else {
            res.send('User not found')
        }


        // res.send(req.body)
    },
    logoutUser: (req, res) => {
        try {
            console.log(`Before nulling : req.session.user is ${req.session.user}`)
            console.log(`Before nulling : req.session is ${req.session}`)

            // req.session.user = null
            req.session.destroy();

            console.log(`After nulling : req.session is ${req.session}`)
            

            res.redirect('/login')
        } catch (error) {
            console.error('Hitted catch: error : ',error)
        }
        

    }

    //To add admin and encrypt password
    // addAdmin:async (req,res)=>{
    //     try {
    //         // let admin = await  Admin.findOne({Email:"Admin@gmail.com"})
    //         const password = bcrypt.hashSync('Admin@123', 10);
    //         const newAdmin = new Admin({Email:"admin@gmail.com", Password:password});
    //         newAdmin.save()
    //         .then(()=>{console.log('New admin Saved')})
    //         .catch((error)=>{console.log('error in saving new admin:',error);})
    //         res.send('Welcome Admin')
    //     } catch (error) {
    //         log.error(error)
    //     }},
}



