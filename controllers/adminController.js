const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const Coupon = require('../models/couponModel')
const moment = require('moment')
require('dotenv').config();


////////////////////Admin credentials/////////////////////////////

const credentials = {
    email: process.env.ADMINEMAIL,
    password: process.env.ADMINPASS,
};

////////////////////ADMIN CONTROLLERS/////////////////////////////

const loadLogin = async (req, res) => {
    try {
        if (req.session.wrongAdmin) {
            res.render("login", { invalid: "invalid details" });
            req.session.wrongAdmin = false;
        } else {
            res.render("login");
        }
    } catch (error) {
        console.log(error.message);
    }
};

const adminLogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect("/admin");
    } catch (error) {
        console.log(error.message);
    }
};

const verifyLogin = async (req, res) => {
    try {
        if (req.body.email == credentials.email && req.body.password == credentials.password) {
            req.session.admin = req.body.email;
            res.redirect("/admin/dashboard");
        } else {
            req.session.wrongAdmin = true;
            res.redirect("/admin");
        }
    } catch (error) {
        console.log(error.messaage);
    }
};

////////////////////DASHBOARD/////////////////////////////

const loadDashboard = async (req, res) => {
    try {
        res.render("dashboard", { user: req.session.admin });
    } catch (error) {
        console.log(error.message);
    }
};

////////////////////USERS/////////////////////////////

const loadUsers = async (req, res) => {
    try {
        const userData = await User.find();
        res.render("users", { users: userData, user: req.session.admin });
    } catch (error) {
        console.log(error.message);
    }
};

const blockUser = async (req, res) => {
    try {
        const id = req.params.id;

        const blockUser = await User.findById(id);

        await User.findByIdAndUpdate(id, { $set: { is_blocked: !blockUser.is_blocked } }, { new: true });

        res.redirect("/admin/users");
    } catch (error) {
        console.log(error);
    }
};

////////////////////ORDERS/////////////////////////////

const loadOrders = async (req, res) => {
    try {
        res.render("orders", { user: req.session.admin });
    } catch (error) {
        console.log(error.message);
    }
};

////////////////////CATEGORIES/////////////////////////////

const loadCategories = async (req, res) => {
    try {
        const categoryData = await Category.find();
        if (req.session.categoryUpdate) {
            res.render("categories", {
                categoryData,
                catUpdated: "Category updated successfully",
                user: req.session.admin,
            });
            req.session.categoryUpdate = false;
        } else if (req.session.categorySave) {
            res.render("categories", {
                categoryData,
                catUpdated: "Category Added successfully",
                user: req.session.admin,
            });
            req.session.categorySave = false;
        } else if (req.session.categoryExist) {
            res.render("categories", {
                categoryData,
                catNoUpdation: "Category Already Exists!!",
                user: req.session.admin,
            });
            req.session.categoryExist = false;
        } else {
            res.render("categories", { categoryData, user: req.session.admin });
        }
    } catch (error) {
        console.log(error.message);
    }
};

const addCategory = async (req, res) => {
    try {
        res.render("addCategory", { user: req.session.admin });
    } catch (error) {
        console.log(error.message);
    }
};

const addNewCategory = async (req, res) => {
    const categoryName = req.body.name;
    const categoryDescription = req.body.categoryDescription;
    const image = req.file;
    const lowerCategoryName = categoryName.toLowerCase();

    try {
        const categoryExist = await Category.findOne({ category: lowerCategoryName });
        if (!categoryExist) {
            const category = new Category({
                category: lowerCategoryName,
                imageUrl: image.filename,
                description: categoryDescription,
            });

            await category.save();
            req.session.categorySave = true;
            res.redirect("/admin/categories");
        } else {
            req.session.categoryExist = true;
            res.redirect("/admin/categories");
        }
    } catch (error) {
        console.log(error.message);
    }
};

const editCategory = async (req, res) => {
    const categoryId = req.params.id;

    try {
        const categoryData = await Category.findById({ _id: categoryId });

        res.render("editCategory", { categoryData, user: req.session.admin });
    } catch (error) {
        console.log(error.message);
    }
};

const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const categoryName = req.body.name;
        const categoryDescription = req.body.categoryDescription;
        const newImage = req.file;

        const categoryData = await Category.findById(categoryId);
        const categoryImage = categoryData.imageUrl;
        let updatedImage;
        if (newImage) {
            updatedImage = newImage.filename;
        } else {
            updatedImage = categoryImage;
        }

        const catExist = await Category.findOne({ category: categoryName });
        const imageExist = await Category.findOne({ category: updatedImage });

        if (!catExist || !imageExist) {
            await Category.findByIdAndUpdate(
                categoryId,
                {
                    category: req.body.name,
                    imageUrl: updatedImage,
                    description: categoryDescription,
                },
                { new: true }
            );
            req.session.categoryUpdate = true;
            res.redirect("/admin/categories");
        } else {
            req.session.categoryExist = true;
            res.redirect("/admin/categories");
        }
    } catch (error) {
        console.log(error.message);
    }
};

const unlistCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;

        const unlistCategory = await Category.findById(categoryId);

        await Category.findByIdAndUpdate(categoryId, { $set: { is_blocked: !unlistCategory.is_blocked } }, { new: true });

        res.status(200).send();
    } catch (error) {
        console.log(error.message);
    }
};

////////////////////PRODUCTS/////////////////////////////

const loadProducts = async (req, res) => {
    try {
        const productData = await Product.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $unwind: "$category",
            },
        ]);

        if (req.session.productSave) {
            res.render("products", {
                productData,
                productUpdated: "Product added successfully!!",
                user: req.session.admin,
            });
            req.session.productSave = false;
        }
        if (req.session.productUpdate) {
            res.render("products", {
                productData,
                productUpdated: "Product Updated successfully!!",
                user: req.session.admin,
            });
            req.session.productUpdate = false;
        } else {
            res.render("products", { productData, user: req.session.admin });
        }
    } catch (error) {
        console.log(error.message);
    }
};

const addProduct = async (req, res) => {
    try {
        const categoryData = await Category.find();

        res.render("addProduct", { categoryData, user: req.session.admin });
    } catch (error) {
        console.log(error.message);
    }
};

const addNewProduct = async (req, res) => {
    try {
        const files = req.files;
        const productImages = [];

        files.forEach((file) => {
            const image = file.filename;
            productImages.push(image);
        });

        const { name, price, quantity, description, category } = req.body;
        const product = new Product({
            name: name,
            price: price,
            stock: quantity,
            description: description,
            category: category,
            imageUrl: productImages,
        });
        await product.save();
        req.session.productSave = true;
        res.redirect("/admin/products");
    } catch (error) {
        console.log(error.message);
    }
};

const updateProduct = async (req, res) => {
    try {
        const proId = req.params.id;

        const productData = await Product.findById({ _id: proId });
        const categories = await Category.find();

        res.render("editProduct", { productData, categories, user: req.session.admin });
    } catch (error) {
        console.log(error.message);
    }
};

const deleteProductImage = async (req, res) => {
    try {
        const { id, image } = req.query;
        const product = await Product.findById(id);

        product.imageUrl.splice(image, 1);

        await product.save();
        res.status(200).send({ message: "Image deleted successfully" });
    } catch (error) {
        console.log(error.message);
    }
};

const updateNewProduct = async (req, res) => {
    try {
        const proId = req.params.id;
        const product = await Product.findById(proId);
        const exImage = product.imageUrl;
        const files = req.files;
        let updImages = [];

        if (files && files.length > 0) {
            const newImages = req.files.map((file) => file.filename);
            updImages = [...exImage, ...newImages];
            product.imageUrl = updImages;
        } else {
            updImages = exImage;
        }

        const { name, price, quantity, description, category } = req.body;
        await Product.findByIdAndUpdate(
            proId,
            {
                name: name,
                price: price,
                stock: quantity,
                description: description,
                category: category,
                imageUrl: updImages,
            },
            { new: true }
        );
        req.session.productUpdate = true;
        res.redirect("/admin/products");
    } catch (error) {
        console.log(error.message);
    }
};

const deleteProduct = async (req, res) => {
    try {
        const deleteId = req.params.id;

        await Product.findByIdAndDelete(deleteId);
        res.status(200).send();
    } catch (error) {
        console.log(error.message);
    }
};


const loadCoupons = async(req,res)=>{
    try {

        const coupon = await Coupon.find()
        const now = moment()

        const couponData = coupon.map((element)=>{
            const formattedDate = moment(element.expiryDate).format("MMMM D, YYYY")

            return {
                ...element,
                expiryDate: formattedDate
            }
        })

        res.render('coupons', { couponData })
        
    } catch (error) {
        console.log(error.messaage);
    }
}



const loadAddCoupon = async (req,res)=>{
    try{

        res.render('addCoupon',{ user: req.session.admin })

    }catch(error){
        console.log(error.messaage);
    }
}



const addCoupon = async(req,res)=>{
    try {

        const { couponCode, couponDiscount, couponDate } = req.body

        const couponCodeUpperCase = couponCode.toUpperCase();

        const couponExist = await Coupon.findOne({ code: couponCodeUpperCase })

        if(!couponExist){
            const coupon = new Coupon({
                code: couponCodeUpperCase,
                discount: couponDiscount,
                expiryDate: couponDate
            })

            await coupon.save()
            res.json({message: "coupon addedd"})
        }else{
            res.json({messaage: "coupon exists"})
        }
        
    } catch (error) {
        console.log(error.messaage);
    }
}


const deleteCoupon = async (req,res)=>{
    try {

        const couponId = req.query.couponId

        await Coupon.findByIdAndDelete(couponId)

        res.json({message: "success"})
       
    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    loadLogin,
    verifyLogin,
    adminLogout,

    loadDashboard,
    loadUsers,
    blockUser,

    loadOrders,

    loadCategories,
    addCategory,
    addNewCategory,
    editCategory,
    updateCategory,
    unlistCategory,

    loadProducts,
    addProduct,
    addNewProduct,
    updateProduct,
    updateNewProduct,
    deleteProductImage,
    deleteProduct,

    loadCoupons,
    loadAddCoupon,
    addCoupon,
    deleteCoupon
    
};
