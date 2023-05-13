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


admin_route.get("/categories", adminAuth.isLogin, adminController.loadCategories)
admin_route.get('/addCategory', adminAuth.isLogin, adminController.addCategory)
admin_route.post('/addCategory', adminAuth.isLogin, store.single('image') , adminController.addNewCategory)
admin_route.get('/editCategory/:id', adminAuth.isLogin, adminController.editCategory)
admin_route.post('/updateCategory/:id', adminAuth.isLogin, store.single('image') , adminController.updateCategory)
admin_route.get('/deleteCategory/:id', adminAuth.isLogin, adminController.deleteCategory)


admin_route.get("/products", adminAuth.isLogin, adminController.loadProducts)
admin_route.get('/addProduct', adminAuth.isLogin, adminController.addProduct)
admin_route.post('/addProduct', adminAuth.isLogin, store.array('image', 4), adminController.addNewProduct)
admin_route.delete('/product_img_delete', adminController.deleteProductImage)
admin_route.get('/updateProduct/:id', store.array('image', 4) , adminAuth.isLogin, adminController.updateProduct)
admin_route.post('/updateProduct/:id', store.array('image', 5) , adminAuth.isLogin, adminController.updateNewProduct)
admin_route.get('/deleteProduct/:id', adminAuth.isLogin, adminController.deleteProduct)



module.exports=admin_route
