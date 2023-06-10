const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const SubCategory = require("../models/subCategoryModel")
const Product = require("../models/productModel");
const Brand = require("../models/brandModel")
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel")
const moment = require("moment");
require("dotenv").config();

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
        const ordersPerPage = 7
        const page = parseInt(req.query.page) || 1
        const skip = (page - 1) * ordersPerPage

        const orders = await Order.find()
        .sort( { date: -1} )
        .skip(skip)
        .limit(ordersPerPage)

        const totalCount = await Order.countDocuments()
        const totalPages = Math.ceil(totalCount / ordersPerPage)

        const orderData = orders.map((order)=>{
            const formattedDate = moment(order.date).format("MMMM D YYYY")

            return {
                ...order.toObject(),
                date: formattedDate
            }
        })



        res.render("orders", { 
            user: req.session.admin, 
            orderData, 
            currentPage: page,
            totalPages  
        });
    } catch (error) {
        console.log(error.message);
    }
};


const updateOrder = async(req,res)=>{
    try {

        const orderId = req.query.orderId
        const status = req.body.status
        console.log(orderId, status);

        const order = await Order.findByIdAndUpdate(
            orderId,
            { $set: { status: status } },
            { new: true }
        )

        res.json({
            messaage: "Success"
        })
        
    } catch (error) {
        console.log(error.message);
    }
}

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
        const imageExist = await Category.findOne({ imageUrl: updatedImage });

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



const loadSubCategories = async (req, res) => {
    try {
        const subCategoryData = await SubCategory.find()

        if (req.session.subCategoryUpdate) {
            res.render("subCategories", {
                subCategoryData,
                catUpdated: "Sub-Category updated successfully",
                user: req.session.admin,
            });
            req.session.subCategoryUpdate = false;

        } else if (req.session.subCategorySave) {
            res.render("subCategories", {
                subCategoryData,
                catUpdated: "Sub-Category Added successfully",
                user: req.session.admin,
            });
            req.session.subCategorySave = false;

        } else if (req.session.subCategoryExist) {
            res.render("subCategories", {
                subCategoryData,
                catNoUpdation: "Sub-Category Already Exists!!",
                user: req.session.admin,
            });
            req.session.subCategoryExist = false;

        } else {
            res.render("subCategories", { subCategoryData, user: req.session.admin });
        }
    } catch (error) {
        console.log(error.message);
    }
};



const addSubCategory = async(req,res)=>{
    try {

        res.render('addSubCategory', { user: req.session.admin })
        
    } catch (error) {
        console.log(error.message);
    }
}



const addNewSubCategory = async (req, res) => {
    const subCategoryName = req.body.name;
    const subCategoryDescription = req.body.subCategoryDescription;
    const image = req.file;
    const lowerSubCategoryName = subCategoryName.toLowerCase();

    try {
        const subCategoryExist = await SubCategory.findOne({ subCategory: lowerSubCategoryName });
        if (!subCategoryExist) {
            const subCategory = new SubCategory({
                subCategory: lowerSubCategoryName,
                imageUrl: image.filename,
                description: subCategoryDescription,
            });

            await subCategory.save();
            req.session.subCategorySave = true;
            res.redirect("/admin/subCategories");
        } else {
            req.session.subCategoryExist = true;
            res.redirect("/admin/subCategories");
        }
    } catch (error) {
        console.log(error.message);
    }
};


const editSubCategory = async (req, res) => {
    const SubCategoryId = req.params.id;

    try {
        const SubCategoryData = await SubCategory.findById({ _id: SubCategoryId });

        res.render("editSubCategory", { SubCategoryData, user: req.session.admin });
    } catch (error) {
        console.log(error.message);
    }
};

const updateSubCategory = async (req, res) => {
    try {
        const subCategoryId = req.params.id;
        const subCategoryName = req.body.name;
        const subCategoryDescription = req.body.subCategoryDescription;
        const newImage = req.file;

        const subCategoryData = await SubCategory.findById(subCategoryId);
        const subCategoryImage = subCategoryData.imageUrl;
        let updatedImage;
        if (newImage) {
            updatedImage = newImage.filename;
        } else {
            updatedImage = subCategoryImage;
        }

        const subCatExist = await SubCategory.findOne({ subCategory: subCategoryName });
        const imageExist = await SubCategory.findOne({ imageUrl: updatedImage });

        if (!subCatExist || !imageExist) {
            await SubCategory.findByIdAndUpdate(
                subCategoryId,
                {
                    subCategory: subCategoryName,
                    imageUrl: updatedImage,
                    description: subCategoryDescription,
                },
                { new: true }
            );
            req.session.subCategoryUpdate = true;
            res.redirect("/admin/subCategories");
        } else {
            req.session.subCategoryExist = true;
            res.redirect("/admin/subCategories");
        }
    } catch (error) {
        console.log(error.message);
    }
};


const unlistSubCategory = async (req, res) => {
    try {
        const subCategoryId = req.params.id;

        const unlistSubCategory = await SubCategory.findById(subCategoryId);

        await SubCategory.findByIdAndUpdate(subCategoryId, { $set: { is_blocked: !unlistSubCategory.is_blocked } }, { new: true });

        res.status(200).send();
    } catch (error) {
        console.log(error.message);
    }
};




////////////////////PRODUCTS/////////////////////////////

const loadProducts = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1
        const productsPerPage = 4

        const totalCount = await Product.countDocuments();
        const totalPages = Math.ceil(totalCount / productsPerPage)
        const skip = (page - 1) * productsPerPage;

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
            },

            {
                $lookup:{
                    from:"brands",
                    localField: "brand",
                    foreignField: "_id",
                    as : "brand"
                }
            },
            {
                $unwind: "$brand"
            }
        ])
        .skip(skip)
        .limit(productsPerPage)

        if (req.session.productSave) {
            res.render("products", {
                productData,
                totalPages,
                currentPage: page,
                productUpdated: "Product added successfully!!",
                user: req.session.admin,
            });
            req.session.productSave = false;
        }
        if (req.session.productUpdate) {
            res.render("products", {
                productData,
                totalPages,
                currentPage: page,
                productUpdated: "Product Updated successfully!!",
                user: req.session.admin,
            });
            req.session.productUpdate = false;
        } else {
            res.render("products", { 
                productData, 
                user: req.session.admin, 
                totalPages,
                currentPage: page,
            });
        }
    } catch (error) {
        console.log(error.message);
    }
};

const addProduct = async (req, res) => {
    try {
        const categoryData = await Category.find();
        const subCategoryData = await SubCategory.find();
        const brands = await Brand.find()

        res.render("addProduct", { categoryData, subCategoryData, brands, user: req.session.admin });
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

        const { name, price, quantity, description, category, subCategory, brand, newBrand } = req.body;

        let brandId;

        if (brand === "new" && newBrand) {
            const newBrandData = new Brand({
                name: newBrand,
            });

            const savedBrand = await newBrandData.save();
            brandId = savedBrand._id;
        } else {
            brandId = brand;
        }

        const product = new Product({
            name: name,
            price: price,
            stock: quantity,
            description: description,
            category: category,
            subCategory: subCategory,
            brand: brandId,
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
        const subCategories = await SubCategory.find()
        const brands = await Brand.find()


        res.render("editProduct", { productData, categories, subCategories, brands, user: req.session.admin });
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

        const { name, price, quantity, description, category, subCategory, brand, newBrand  } = req.body;

        let brandId

        if(brand === "new" && newBrand){
            const newBrandData = new Brand({
                name: newBrand
            })

            const savedBrand = await newBrandData.save()
            brandId = savedBrand._id
        }else{
            brandId = brand
        }

        await Product.findByIdAndUpdate(
            proId,
            {
                name: name,
                price: price,
                stock: quantity,
                description: description,
                category: category,
                subCategory: subCategory,
                brand: brandId,
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

const loadCoupons = async (req, res) => {
    try {
        const coupon = await Coupon.find();

        const couponData = coupon.map((element) => {
            const formattedDate = moment(element.expiryDate).format("MMMM D, YYYY");

            return {
                ...element,
                expiryDate: formattedDate,
            };
        });

        res.render("coupons", { couponData });
    } catch (error) {
        console.log(error.messaage);
    }
};

const loadAddCoupon = async (req, res) => {
    try {
        res.render("addCoupon", { user: req.session.admin });
    } catch (error) {
        console.log(error.messaage);
    }
};

const addCoupon = async (req, res) => {
    try {
        const { couponCode, couponDiscount, couponDate } = req.body;

        const couponCodeUpperCase = couponCode.toUpperCase();

        const couponExist = await Coupon.findOne({ code: couponCodeUpperCase });

        if (!couponExist) {
            const coupon = new Coupon({
                code: couponCodeUpperCase,
                discount: couponDiscount,
                expiryDate: couponDate,
            });

            await coupon.save();
            res.json({ message: "coupon addedd" });
        } else {
            res.json({ messaage: "coupon exists" });
        }
    } catch (error) {
        console.log(error.messaage);
    }
};

const blockCoupon = async (req, res) => {
    try {
        const couponId = req.query.couponId;

        const unlistCoupon = await Coupon.findById(couponId);

        await Coupon.findByIdAndUpdate(couponId, { $set: { status: !unlistCoupon.status } }, { new: true });

        res.json({ message: "success" });
    } catch (error) {
        console.log(error.message);
    }
};

const deleteCoupon = async (req, res) => {
    try {
        const couponId = req.query.couponId;

        await Coupon.findByIdAndDelete(couponId);

        res.json({ message: "success" });
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    loadLogin,
    verifyLogin,
    adminLogout,

    loadDashboard,
    loadUsers,
    blockUser,

    loadOrders,
    updateOrder,

    loadCategories,
    addCategory,
    addNewCategory,
    editCategory,
    updateCategory,
    unlistCategory,

    loadSubCategories,
    addSubCategory,
    addNewSubCategory,
    editSubCategory,
    updateSubCategory,
    unlistSubCategory,


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
    deleteCoupon,
    blockCoupon,
};
