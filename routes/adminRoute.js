const adminController = require("../controllers/adminController");
const express = require("express");
const adminAuth= require('../middleware/adminAuth');
const store = require("../middleware/multer");
const admin_route = express();
admin_route.set("views", "./views/admin");


////////////////////Admin routes/////////////////////////////



admin_route.get('/',adminAuth.isLogout ,adminController.loadLogin)
admin_route.post('/login',adminController.verifyLogin)
admin_route.get('/logout',adminController.adminLogout)


admin_route.get("/dashboard", adminAuth.isLogin, adminController.loadDashboard);

admin_route.get("/users", adminAuth.isLogin, adminController.loadUsers)
admin_route.get("/blockUser/:id", adminAuth.isLogin, adminController.blockUser);


admin_route.get("/orders",adminController.loadOrders)
admin_route.post('/updateOrder', adminController.updateOrder)
admin_route.get('/orderDetails', adminController.orderDetails)


admin_route.get("/categories", adminAuth.isLogin, adminController.loadCategories)
admin_route.get('/addCategory', adminAuth.isLogin, adminController.addCategory)
admin_route.post('/addCategory', adminAuth.isLogin, store.single('image') , adminController.addNewCategory)
admin_route.get('/editCategory/:id', adminAuth.isLogin, adminController.editCategory)
admin_route.post('/updateCategory/:id', adminAuth.isLogin, store.single('image') , adminController.updateCategory)
admin_route.get('/unlistCategory/:id', adminAuth.isLogin, adminController.unlistCategory)

admin_route.get("/subCategories", adminAuth.isLogin, adminController.loadSubCategories)
admin_route.get('/addSubCategory', adminAuth.isLogin, adminController.addSubCategory)
admin_route.post('/addSubCategory', adminAuth.isLogin, store.single('image') , adminController.addNewSubCategory)
admin_route.get('/editSubCategory/:id', adminAuth.isLogin, adminController.editSubCategory)
admin_route.post('/updateSubCategory/:id', adminAuth.isLogin, store.single('image') , adminController.updateSubCategory)
admin_route.get('/unlistSubCategory/:id', adminAuth.isLogin, adminController.unlistSubCategory)

admin_route.get("/banners", adminAuth.isLogin, adminController.loadBanners)
admin_route.get("/addBanner", adminAuth.isLogin, adminController.addBanner)
admin_route.post('/addBanner', adminAuth.isLogin, store.single('image') , adminController.addNewBanner)
admin_route.get('/updateBanner/:id', adminAuth.isLogin, adminController.editBanner)
admin_route.post('/updateBanner/:id', adminAuth.isLogin, store.single('image') , adminController.updateBanner)
admin_route.get('/bannerStatus/:id', adminAuth.isLogin, adminController.bannerStatus)


admin_route.get("/products", adminAuth.isLogin, adminController.loadProducts)
admin_route.get('/addProduct', adminAuth.isLogin, adminController.addProduct)
admin_route.post('/addProduct', adminAuth.isLogin, store.array('image', 4), adminController.addNewProduct)
admin_route.delete('/product_img_delete', adminController.deleteProductImage)
admin_route.get('/updateProduct/:id', store.array('image', 4) , adminAuth.isLogin, adminController.updateProduct)
admin_route.post('/updateProduct/:id', store.array('image', 5) , adminAuth.isLogin, adminController.updateNewProduct)
admin_route.get('/deleteProduct/:id', adminAuth.isLogin, adminController.deleteProduct)


admin_route.get('/coupons', adminAuth.isLogin, adminController.loadCoupons)
admin_route.get('/loadAddCoupon', adminAuth.isLogin, adminController.loadAddCoupon)
admin_route.post('/addCoupon', adminController.addCoupon)
admin_route.post('/blockCoupon', adminController.blockCoupon)
admin_route.post('/deleteCoupon', adminController.deleteCoupon)



module.exports=admin_route

