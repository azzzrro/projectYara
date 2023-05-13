const userController = require("../controllers/userController");
const products = require('../controllers/products')
const auth = require("../middleware/userAuth")
const express = require("express");
const user_route = express();
const { isLogout, isLogin } = auth
user_route.set("views", "./views/users");




////////////////////User routes/////////////////////////////



user_route.get("/",  userController.homeload);
// user_route.get("/landing",isLogout,   userController.landing)


user_route.get("/login", isLogout,  userController.login)
user_route.post('/login',  userController.verifyLogin);


user_route.get("/signup", isLogout,  userController.signup);
user_route.post('/signup',  userController.sendOtp)
user_route.get('/showOtp',isLogout, userController.showOtp)
user_route.post('/otpEnter',isLogout ,userController.verifyOtp);


user_route.get('/forgotPassword',isLogout,userController.loadForgotPassword)
user_route.post('/verifyEmail',isLogout,userController.verifyForgotEmail)
user_route.get('/forgotOtpEnter',isLogout,userController.showForgotOtp)
user_route.post('/verifyForgotOtp',isLogout,userController.verifyForgotOtp)
user_route.get('/resendForgotPasswordotp', isLogout ,userController.resendForgotOtp)
user_route.post('/newPassword',isLogout, userController.updatePassword)

user_route.get("/home", isLogin,  userController.homeload);
user_route.get('/logout',  userController.doLogout)


user_route.get("/products", products.loadProducts)
user_route.get("/productView", products.productView)

user_route.get('/cart',userController.loadCart)




module.exports = user_route;