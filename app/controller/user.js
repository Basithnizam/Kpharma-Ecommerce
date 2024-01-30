const user = require('../model/userSchema')  // const mongoose = require('mongoose');
const category = require('../model/categorySchema') 
const product = require('../model/productSchema') 
const bcrypt = require('bcrypt');
const { validateRequestWithBody } = require('twilio/lib/webhooks/webhooks');
// const Admin = require('../model/adminSchema'); Used to add admin for user.js


// function generateOTP() {
//     return Math.floor(100000 + Math.random() * 900000);
// }
function generateOTP(){
    let otp = Math.floor(100000 + Math.random() * 900000);
    const timestamp = new Date().getTime();

    return `${otp}-${timestamp}`;
}

// Function to send OTP via Twilio
async function sendOTP(phone, otp) {
    try {

        const accountSid = process.env.TWILIO_SID;
        const authToken = process.env.TWILIO_ACCESS_TOKEN;
        const client = require('twilio')(accountSid, authToken);

        const message = `Your Kpharma verification OTP(One-Time-Password) is ${otp}`;

        await client.messages.create({
            body: message,
            from: '+19066296777',
            to: phone
        });
    } catch (error) {
        console.error('The error in sendOTP(): ', error)
    }

}

module.exports = {
    viewSignUp: (req, res) => {
        var error = { noError: 'hello' }
        console.log('Test: ', error.noError)
        res.render('signUp', {
            emailError: req.flash('emailError'),
            numberError: req.flash('numberError'),
            timeOut: req.flash('timeOut') 
            
        })
    },
    //Post
    signInUser: async (req, res) => {
        try {
            const userExistsEmail = await user.findOne({ email: req.body.email });
            const userExistsPhone = await user.findOne({ phone: req.body.phone });
            

            // console.log("Input data: ",existingData)
            if (userExistsEmail) {
                req.flash("emailError", 'This email is already in use')
                res.redirect('signup')


            }
            else if (userExistsPhone) {
                req.flash("numberError", 'This number  is already registered')
                res.redirect('signup')

            }
            else {
                try {
                    // Generate and send OTP
                    
                    // let [otp,timestamp] = generateOTP().split('-');
                    let generatedOtp =  generateOTP()
                    console.log('generatedOtp: ', generatedOtp)
                    let [otp,timestamp] = generatedOtp.split('-');

                    
                    
                    const number = "+917012736703" // for development only otp set to this number

                    // const number = "+91" + req.body.phone;

                    console.log('before  sendOTP()')



                    await sendOTP(number, otp);

                    // Store OTP and user input data in session
                    req.session.otp  = otp;
                    req.session.generatedOtp = generatedOtp;
                    
                    // req.session.userData = req.body;
                    req.session.userData = req.body;



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
         if(req.session.generatedOtp){
            res.render('verifyOtp', {
                invalidOtp:req.flash('invalidOpt'),
                otpExpire: req.flash('otpExpire')
                
             })
         }else{
            req.flash('timeOut', 'Error! Time out')
            res.redirect('/signUp')
         }
        
        
        
       
    },
    // OTP Verification POST Request
    otpVerification: (req, res) => {
        const currentTime = Date.now();
        let userInputOtp = req.body.otp
      
        if (req.session.generatedOtp){
            let [storedOtp,storedTime] = req.session.generatedOtp.split('-');
            const maxAge = 30*1000;
            if(currentTime - storedTime <= maxAge ){
                if(userInputOtp === storedOtp){
                    let userData = req.session.userData;
                    if (!userData) {
                        res.status(500).send('Try again');
                    }
                    
                    let hashedPassword = bcrypt.hashSync(userData.password, 10);
                    userData.password = hashedPassword
                    const newUser = new user(
                        userData
                    );
                    newUser.save()
                .then(() => {
                    // Clear OTP and user data from session
                    
                    
                    // res.status(201).json({ success: "Account created" });
                    req.flash('signUpSuccess', 'SignUp  Successful')
                    res.redirect('/login')
                    delete req.session.otp;
                    delete req.session.userData;
                    delete req.session
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).json({ error: "Error creating user account" });
                })

                }else{
                    req.flash('invalidOpt','Invalid OTP')
                    res.redirect('/otpVerify')
                }

            }else{
                req.flash('otpExpire','Otp Expired! Resend OTP')
                
                res.redirect('/otpVerify')
            }

        
           
        }else{
            req.flash('timeOut', 'Error! Time out')
            res.redirect('/signUp')
        }
        // console.log("userInput : " + userInputOtp + " storeotp : " + storedOtp)
        // if (userInputOtp === storedOtp) {
        //     // OTP is valid, retrieve user input data from session
        //     const userData = req.session.userData;
        //     console.log("till here")
        //     if (!userData) {
        //         return res.status(500).send('Try again');
        //     }
        //     console.log("also here");

        //     // Create the user account
        //     const password = userData.password
        //     // const { fullname, email, phone, address, password, baseImage } = userData;
        //     const hashedPassword = bcrypt.hashSync(password, 10);
        //     userData.password = hashedPassword

        //     console.log(userData)


        //     // Save user data to the database
        //     const newUser = new user(
        //         userData
        //     );

        //     newUser.save()
        //         .then(() => {
        //             req.flash('signUpSuccess','SignUp Sucessfully')
        //             // Clear OTP and user data from session
        //             res.redirect('/login')
        //             delete req.session.otp;
        //             delete req.session.userData;
        //             // res.status(201).json({ success: "Account created" });
        //         })
        //         .catch((error) => {
        //             console.error(error);
        //             res.status(500).json({ error: "Error creating user account" });
        //         });
        // } else {
        //     res.render('verifyOtp', { mobileNumber, failed: 'Invalid OTP' });
        // }
    },

    resendOtp: async (req, res) => {
        try {
            let generatedOtp =  generateOTP()
            let [otp,timestamp] = generatedOtp.split('-');
            

            // Assuming req.session.otp is used to store the OTP
            req.session.otp = otp;
            req.session.generatedOtp = generatedOtp;

            // Replace this line with the actual phone number from req.session.userData
            number = '+917012736703'

            // Send OTP here, you might want to use a promise-based approach
            sendOTP(number, otp)
                .then(() => {
                    console.log('OTP resend successful');
                    res.status(200).send('success'); // Send 'success' response to the frontend
                })
                .catch(error => {
                    console.error('Error sending OTP:', error);
                    res.status(500).send('error'); // Send 'error' response to the frontend
                });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('error'); // Send 'error' response to the frontend
        }
    },


    //load login page
    viewLoginInPage: (req, res) => {
        if (req.session.user) {
            res.redirect('/home')
        } else {
            res.render('userLogin', {
                emailError: req.flash('emailError'),
                passwordError: req.flash('passwordError'),
                blockedError: req.flash('blockedError'),
                signUpSuccess : req.flash('signUpSuccess')
            })
        }
    },
    userLogin: async (req, res) => {

        const USER = await user.findOne({ email: req.body.email });
        if (USER) {
            if (USER.blocked) {
                req.flash('blockedError', 'This Account Is BLOCKED')
                res.redirect('/login')
            }
            else {
                const isPasswordValid = await bcrypt.compare(req.body.password, USER.password);
                if (isPasswordValid) {
                    req.session.user = USER;
                    console.log('users req.sessionID' ,req.sessionID)
                    res.redirect('/home')

                } else {
                    req.flash('passwordError', 'Incorrect Password')
                    res.redirect('/login')
                }
            }
        } else {
            req.flash('emailError', 'Invalid Email')
            res.redirect("/login")
        }
    },
    viewHomePage:async (req, res) => {
        let CATEGORY =  await category.find({})
        let PRODUCT =  await product.find({}).sort({productName: 1})
        res.render('userHomePage',{CATEGORY,PRODUCT})
    },
    productLandingpage: async(req, res) => {
        const productId = req.params.id;

        let PRODUCT =  await product.findById(productId)

        res.render('productLanding', {PRODUCT})
    },
    addToCart: (req,res)=>{
        res.send('Page Under Constuction')
    },
    viewUserProfile:(req,res)=>{
        res.render('userProfile')
    },
    logoutUser: (req, res) => {
        try {
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                } else {
                    // Redirect to the home page after destroying the session
                    res.redirect('/login')

                }
            });
        } catch (error) {
            console.error('Hitted catch: error : ', error)
        }


    }
}



