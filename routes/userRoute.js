const userController = require("../controllers/userController");
const productController = require('../controllers/productController')
const cartController = require('../controllers/cartController')
const orderController = require('../controllers/orderController')

const auth = require("../middleware/userAuth")
const express = require("express");
const user_route = express();
const { isLogout, isLogin, blockCheck } = auth
user_route.set("views", "./views/users");




////////////////////User routes/////////////////////////////



user_route.get("/",  userController.homeload);
// user_route.get("/landing",isLogout,   userController.landing)


user_route.get("/login", isLogout,  userController.login)
user_route.post('/login',  userController.verifyLogin);
user_route.get('/logout',  userController.doLogout)


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


user_route.get("/home", isLogin, blockCheck,  userController.homeload);
user_route.get('/profile', isLogin, blockCheck, userController.loadProfile)


user_route.post('/addNewAddress', userController.addNewAddress)
user_route.get('/addressData', userController.getAddressdata)
user_route.post('/updateAddress', userController.updateAddress)
user_route.get('/deleteAddress', userController.deleteAddress)


user_route.get('/allProducts', blockCheck, productController.loadAllProducts)
user_route.get("/products", blockCheck, productController.loadProducts)
user_route.get("/productView", blockCheck, productController.productView)


user_route.get('/categoryFilter', productController.categoryFilter)
user_route.get('/subCategoryFilter', productController.subCategoryFilter)
user_route.get('/brandFilter', productController.brandFilter)
user_route.post('/sortProduct', productController.sortProduct)


user_route.get('/wishlist', isLogin, blockCheck, cartController.loadWishlist)
user_route.get('/addToWishlist', cartController.addToWishlist)
user_route.get('/removeWishlist', cartController.removeWishlist)
user_route.get('/addToCartFromWishlist', cartController.addToCartFromWishlist)


user_route.get('/cart', isLogin, blockCheck, cartController.loadCart)
user_route.get('/addToCart',cartController.addToCart)
user_route.post('/cartUpdation',cartController.updateCart)
user_route.get('/removeCart',cartController.removeCart)
user_route.get('/checkStock', cartController.checkStock)
user_route.get('/checkout', isLogin, blockCheck, cartController.loadCheckout)
user_route.post('/validateCoupon', cartController.validateCoupon)


user_route.post('/placeOrder', orderController.placeOrder)
user_route.get('/orderSuccess', orderController.orderSuccess)
user_route.get('/myOrders', orderController.myOrders)
user_route.get('/orderDetails',orderController.orderDetails)
user_route.get('/orderFilter', orderController.filterOrder)
user_route.post('/updateOrder', orderController.updateOrder)



module.exports = user_route;