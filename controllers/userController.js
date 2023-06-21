const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const SubCategory = require("../models/subCategoryModel");
const Address = require("../models/addressModel");
const Products = require("../models/productModel");
const Banner = require("../models/bannerModel")
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const moment = require('moment')

////////////////////User Controllers/////////////////////////////

const signup = async (req, res) => {
    try {
        res.render("signup");
    } catch (error) {
        console.log(error.message);
    }
};

const login = async (req, res) => {
    try {
        if (req.session.passwordUpdated) {
            res.render("login", { success: "Password changed successfully!!" });
            req.session.passwordUpdated = false;
        } else {
            res.render("login");
        }
    } catch (error) {
        console.log(error.message);
    }
};

////////////////////Password Encryption/////////////////////////////

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
};

////////////////////User verification/////////////////////////////

let saveOtp;
let name;
let email;
let mobile;
let password;
let forgotPasswordOtp;
let referredCode

const sendOtp = async (req, res) => {
    try {
        const emailExist = await User.findOne({ email: req.body.email });
        if (!emailExist) {
            if (req.body.referralCode) {
                const referralExists = await User.findOne({ referralCode: req.body.referralCode });
                if (!referralExists) {
                    res.render("signup", { alreadyUser: "Invalid referral code" });
                } else {
                    const generatedOtp = generateOTP();
                    saveOtp = generatedOtp;
                    name = req.body.name;
                    email = req.body.signupEmail;
                    mobile = req.body.mobile;
                    password = req.body.password_signup;
                    referredCode = req.body.referralCode;

                    sendOtpMail(email, generatedOtp);
                    res.redirect("/showOtp");
                }
            } else {
                const generatedOtp = generateOTP();
                saveOtp = generatedOtp;
                name = req.body.name;
                email = req.body.signupEmail;
                mobile = req.body.mobile;
                password = req.body.password_signup;

                sendOtpMail(email, generatedOtp);
                res.redirect("/showOtp");
            }
                        
        } else {
            res.render("signup", { alreadyUser: "user already exist" });
        }
    } catch (error) {
        console.log(error.message);
    }
};

const showOtp = async (req, res) => {
    try {
        res.render("enterOtp");
    } catch (error) {}
};

function generateOTP() {
    let otp = "";
    for (let i = 0; i < 6; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
}

async function sendOtpMail(email, otp) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "helloazzzrro@gmail.com",
                pass: "zlvmevlxhpndvduw",
            },
        });

        const mailOptions = {
            from: "helloazzzrro@gmail.com",
            to: email,
            subject: "Your OTP for user verification",
            text: `Your OTP is ${otp}. Please enter this code to verify your account.`,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(result);
    } catch (error) {
        console.log(error.message);
    }
}

const verifyOtp = async (req, res) => {
    const EnteredOtp = req.body.otp;
    if (EnteredOtp === saveOtp) {
        let referredUser = null
        if (referredCode) {
            try {
                referredUser = await User.findOne({ referralCode: referredCode });
                if (referredUser) {
                    referredUser.wallet.balance += 1000;
                    const transaction = {
                        date: new Date(),
                        details: "Referral Bonus",
                        amount: 1000,
                        status: "Credit",
                    };
                    referredUser.wallet.transactions.push(transaction);
                    await referredUser.save();
                }
            } catch (error) {
                console.log(error)
            }
        }

        const securedPassword = await securePassword(password);

        const result = Math.random().toString(36).substring(2, 7);
        const id = Math.floor(100000 + Math.random() * 900000);
        const referralCode = result.toUpperCase() + id.toString().substring(0, 5);

        const newUser = new User({
            name: name,
            email: email,
            mobile: mobile,
            is_blocked: false,
            password: securedPassword,
            referralCode: referralCode
        });

        if (referredUser) {
            newUser.wallet.balance += 500;
            const transaction = {
                date: new Date(),
                details: "Referral Bonus",
                amount: 500,
                status: "Credit",
            };
            newUser.wallet.transactions.push(transaction);
            
        }

        try {
            await newUser.save();
            if (referredUser) {
                res.render("login", { 
                    success: "Successfully registered!", 
                    referral: "Referral success! Your bonus will be credited." });
            } else {
                res.render("login", { success: "Successfully registered!" });
            }
        } catch (error) {
            console.log(error);
            res.render("enterOtp", { invalidOtp: "Error registering new user" });
        }

    } else {
        res.render("enterOtp", { invalidOtp: "wrong OTP" });
    }
};

const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({ email: email });

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);
            if (userData.is_blocked === true) {
                return res.render("login", { blocked: "Your account is blocked - conatct: yara@gmail.com" });
            }

            if (passwordMatch) {
                req.session.user = userData;
                res.redirect("/home");
            }
            if (!passwordMatch) {
                res.render("login", { invalid: "Entered password is wrong" });
            }
        } else {
            res.render("login", { invalid: "You are not registered. please register now!!" });
        }
    } catch (error) {
        console.log(error.message);
    }
};

////////////////////Forgot Password/////////////////////////////

const loadForgotPassword = async (req, res) => {
    try {
        if (req.session.forgotEmailNotExist) {
            res.render("verifyEmail", { emailNotExist: "Sorry, email does not exist! Please register now!" });
            req.session.forgotEmailNotExist = false;
        } else {
            res.render("verifyEmail");
        }
    } catch (error) {
        console.log(error.message);
    }
};

const verifyForgotEmail = async (req, res) => {
    try {
        const verifyEmail = req.body.email;
        const ExistingEmail = await User.findOne({ email: verifyEmail });

        if (ExistingEmail) {
            if (!forgotPasswordOtp) {
                forgotPasswordOtp = generateOTP();
                email = verifyEmail;
                sendForgotPasswordOtp(email, forgotPasswordOtp);
                res.redirect("/forgotOtpEnter");
                setTimeout(() => {
                    forgotPasswordOtp = null;
                }, 60 * 1000);
            } else {
                res.redirect("/forgotOtpEnter");
            }
        } else {
            req.session.forgotEmailNotExist = true;
            res.redirect("/forgotPassword");
        }
    } catch (error) {
        console.log(error.message);
    }
};

async function sendForgotPasswordOtp(email, otp) {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "helloazzzrro@gmail.com",
                pass: "zlvmevlxhpndvduw",
            },
        });

        const mailOptions = {
            from: "helloazzzrro@gmail.com",
            to: email,
            subject: "Your OTP for password resetting",
            text: `Your OTP is ${otp}. Please enter this code to reset your password.`,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(result);
    } catch (error) {
        console.log(error.message);
    }
}

const resendForgotOtp = async (req, res) => {
    try {
        const generatedOtp = generateOTP();
        forgotPasswordOtp = generatedOtp;

        sendForgotPasswordOtp(email, generatedOtp);
        res.redirect("/forgotOtpEnter");
        setTimeout(() => {
            forgotPasswordOtp = null;
        }, 60 * 1000);
    } catch (error) {
        console.log(error.message);
    }
};

const showForgotOtp = async (req, res) => {
    try {
        if (req.session.wrongOtp) {
            res.render("forgotOtpEnter", { invalidOtp: "Otp does not match" });
            req.session.wrongOtp = false;
        } else {
            res.render("forgotOtpEnter", { countdown: true });
        }
    } catch (error) {
        console.log(error.message);
    }
};

const verifyForgotOtp = async (req, res) => {
    try {
        const userEnteredOtp = req.body.otp;
        if (userEnteredOtp === forgotPasswordOtp) {
            res.render("passwordReset");
        } else {
            req.session.wrongOtp = true;
            res.redirect("/forgotOtpEnter");
        }
    } catch (error) {
        console.log(error.message);
    }
};

const updatePassword = async (req, res) => {
    try {
        const newPassword = req.body.password;
        const securedPassword = await securePassword(newPassword);

        const userData = await User.findOneAndUpdate({ email: email }, { $set: { password: securedPassword } });
        if (userData) {
            req.session.passwordUpdated = true;
            res.redirect("/login");
        } else {
            console.log("Something error happened");
        }
    } catch (error) {
        console.log(error.message);
    }
};

////////////////////User verification End/////////////////////////////

const homeload = async (req, res) => {
    try {
        const categoryData = await Category.find({ is_blocked: false });
        const subCategoryData = await SubCategory.find({ is_blocked: false });
        const bannerData = await Banner.find({ active: true });
        const userData = req.session.user;
        console.log("userData:", userData)
        const offerProducts = await Products.aggregate([
            { $match: { offerlabel: { $ne: [] } } },
            { $sample: { size: 4 } },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category",
                },
            },{
                $unwind: "$category",
            },
            {
                $lookup: {
                    from: "subcategories",
                    localField: "subCategory",
                    foreignField: "_id",
                    as: "subCategory",
                },
            },
            {
                $unwind: "$subCategory",
            }
        ]);

        if (userData) {
            const userId = userData._id;
            let cartId = null;
            const user = await User.findOne({ _id: userId }).populate("cart.product").lean();
            console.log("user:", user);
            if (user.cart && user.cart.length > 0) {
                cartId = user.cart[0]._id;
            }

            res.render("home", { userData, cartId, categoryData, bannerData, subCategoryData, offerProducts });
        } else {
            res.render("home", { categoryData, subCategoryData, bannerData, offerProducts });
        }
    } catch (error) {
        console.log(error.message);
    }
};


const loadProfile = async (req, res) => {
    try {
        const userData = req.session.user;
        const userId = userData._id;
        const categoryData = await Category.find({ is_blocked: false });
        const addressData = await Address.find({ userId: userId });

        const user = await User.findById(userId);
        const transactions = user.wallet.transactions.sort((a, b) => b.date - a.date);

        const newTransactions = transactions.map((transactions) => {
            const formattedDate = moment(transactions.date).format("MMMM D, YYYY");
            return { ...transactions.toObject(), date: formattedDate };
        });

        res.render("account", { userData, categoryData, addressData, newTransactions });
    } catch (error) {
        console.log(error.message);
    }
};

const addNewAddress = async (req, res) => {
    try {
        const userData = req.session.user;
        const userId = userData._id;

        const address = new Address({
            userId: userId,
            name: req.body.name,
            mobile: req.body.mobileNumber,
            addressLine: req.body.addressLine,
            city: req.body.city,
            email: req.body.email,
            state: req.body.state,
            pincode: req.body.pincode,
            is_default: false,
        });

        await address.save();
        res.status(200).send();
    } catch (error) {
        res.status(500).send();
        console.log(error.message);
    }
};

const getAddressdata = async (req, res) => {
    try {
        const addressId = req.query.addressId;
        const addressData = await Address.findById(addressId);

        if (addressData) {
            res.json(addressData); // Return the addressData as JSON response
        } else {
            res.json({ message: "Address not found" }); // Handle address not found case
        }
    } catch {
        console.log(error.message);
    }
};

const updateAddress = async (req, res) => {
    try {
        const addressId = req.query.addressId;

        console.log(addressId);

        const updatedAddress = await Address.findByIdAndUpdate(
            addressId,
            {
                name: req.body.name,
                mobile: req.body.mobile,
                addressLine: req.body.addressLine,
                email: req.body.email,
                city: req.body.city,
                state: req.body.state,
                pincode: req.body.pincode,
            },
            { new: true }
        );

        if (updatedAddress) {
            res.status(200).send();
        } else {
            res.status(500).send();
        }
    } catch (error) {
        console.log(error.message);
    }
};

const deleteAddress = async (req, res) => {
    try {
        const addressId = req.query.addressId;

        const success = await Address.findByIdAndDelete(addressId);

        if (success) {
            res.status(200).send();
        } else {
            res.status(500).send();
        }
    } catch (error) {
        console.log(error.message);
    }
};

const doLogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect("/login");
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    signup,
    login,

    homeload,
    sendOtp,
    showOtp,
    verifyOtp,
    verifyLogin,

    loadForgotPassword,
    verifyForgotEmail,
    showForgotOtp,
    verifyForgotOtp,
    resendForgotOtp,
    updatePassword,

    loadProfile,
    addNewAddress,
    getAddressdata,
    updateAddress,
    deleteAddress,

    doLogout,
};
