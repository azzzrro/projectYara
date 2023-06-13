const Category = require("../models/categoryModel");
const SubCategory = require("../models/subCategoryModel");
const Product = require("../models/productModel");
const Brand = require("../models/brandModel");
const User = require("../models/userModel");

////////////////////Products/////////////////////////////

const loadAllProducts = async (req, res) => {
    const categoryData = await Category.find({ is_blocked: false });
    const categoryFilterData = await Category.find({ is_blocked: false });

    const subCategoryData = await SubCategory.find();

    try {
        const page = parseInt(req.query.allProductsPage) || 1; // Get the current page number from the query parameter
        const productsPerPage = 6;

        categoryFilterData.forEach(async (category, index) => {
            const productCount = await Product.countDocuments({ category: category._id });
            categoryFilterData[index].productCount = productCount;
        });

        subCategoryData.forEach(async (subCategory, index) => {
            const productCount = await Product.countDocuments({ subCategory: subCategory._id });
            subCategoryData[index].productCount = productCount;
        });

        const brandData = await Brand.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "brand",
                    as: "products",
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    productCount: { $size: "$products" },
                },
            },
        ]);

        let productData;

        const search = req.query.search;

        if (search) {
            productData = await Product.find({
                name: { $regex: ".*" + search + ".*", $options: "i" },
            })
                .skip((page - 1) * productsPerPage)
                .limit(productsPerPage);
        } else {
            productData = await Product.find()
                .skip((page - 1) * productsPerPage)
                .limit(productsPerPage);
        }

        const totalCount = search
            ? await Product.countDocuments({ name: { $regex: ".*" + search + ".*", $options: "i" } })
            : await Product.countDocuments();

        const totalPages = Math.ceil(totalCount / productsPerPage);

        if (req.session.user) {
            const userData = req.session.user;
            res.render("allProducts", {
                userData,
                productData,
                categoryData,
                categoryFilterData,
                subCategoryData,
                brandData,
                currentPage: page,
                totalPages,
            });
        } else {
            res.render("allProducts", {
                productData,
                categoryData,
                categoryFilterData,
                subCategoryData,
                brandData,
                currentPage: page,
                totalPages,
            });
        }
    } catch (error) {
        console.log(error.message);
        const userData = req.session.user;
        res.render("404", { userData, categoryData });
    }
};

const categoryFilter = async (req, res) => {
    try {
        const categoryId = req.query.categoryId;

        const productData = await Product.find({ category: categoryId });
        res.json(productData);
    } catch (error) {
        console.log(error.message);
    }
};

const subCategoryFilter = async (req, res) => {
    try {
        const subCategoryId = req.query.subCategoryId;

        const productData = await Product.find({ subCategory: subCategoryId });
        res.json(productData);
    } catch (error) {
        console.log(error.message);
    }
};

const brandFilter = async (req, res) => {
    try {
        const brandId = req.query.brandId;

        const productData = await Product.find({ brand: brandId });
        res.json(productData);
    } catch (error) {
        console.log(error.message);
    }
};

const sortProduct = async (req, res) => {
    try {
        const sort = req.body.sort;
        const productData = await Product.find().sort({ price: sort });
        res.json(productData);
    } catch (error) {
        console.log(error.message);
    }
};

const loadProducts = async (req, res) => {
    const categoryData = await Category.find({ is_blocked: false });
    const subCategoryData = await SubCategory.find();

    try {
        const page = parseInt(req.query.page) || 1; // Get the current page number from the query parameter
        const productsPerPage = 6;

        subCategoryData.forEach(async (subCategory, index) => {
            const productCount = await Product.countDocuments({ subCategory: subCategory._id });
            subCategoryData[index].productCount = productCount;
        });

        const brandData = await Brand.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "brand",
                    as: "products",
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    productCount: { $size: "$products" },
                },
            },
        ]);

        const id = req.query.id;
        let productData;
        let totalCount

        
            const isCategory = await Category.exists({ _id: id });

            if (isCategory) {
                productData = await Product.find({ category: id })
                    .skip((page - 1) * productsPerPage)
                    .limit(productsPerPage);
                
                totalCount = await Product.countDocuments({ category: id });
            } else {
                productData = await Product.find({ subCategory: id })
                    .skip((page - 1) * productsPerPage)
                    .limit(productsPerPage);

                totalCount = await Product.countDocuments({ subCategory: id });
            }
        

        
        const totalPages = Math.ceil(totalCount / productsPerPage);

        const userData = req.session.user;

        res.render("products", {
            id,
            productData,
            categoryData,
            userData,
            subCategoryData,
            brandData,
            currentPage: page,
            totalPages,
        });
    } catch (error) {
        console.log(error.message);
        const userData = req.session.user;
        res.render("404", { userData, categoryData });
    }
};


const offerProducts = async (req, res) => {
    const categoryData = await Category.find({ is_blocked: false });
    const subCategoryData = await SubCategory.find();

    try {
        const page = parseInt(req.query.offerPage) || 1; // Get the current page number from the query parameter
        const productsPerPage = 6;

        subCategoryData.forEach(async (subCategory, index) => {
            const productCount = await Product.countDocuments({ subCategory: subCategory._id });
            subCategoryData[index].productCount = productCount;
        });

        const brandData = await Brand.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "brand",
                    as: "products",
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    productCount: { $size: "$products" },
                },
            },
        ]);

        const offerlabel = req.query.label;

        const productData = await Product.find({ offerlabel: { $in: offerlabel } })
            .skip((page - 1) * productsPerPage)
            .limit(productsPerPage);

        const totalCount = await Product.countDocuments({ offerlabel: { $in: offerlabel } });
        const totalPages = Math.ceil(totalCount / productsPerPage);

        const userData = req.session.user;

        res.render("offerProducts", {
            productData,
            categoryData,
            userData,
            subCategoryData,
            brandData,
            currentPage: page,
            totalPages,
            offerHeading:`${offerlabel} offer`
        });
    } catch (error) {
        console.log(error.message);
        const userData = req.session.user;
        res.render("404", { userData, categoryData });
    }
};



const productView = async (req, res) => {
    try {
        const productId = req.query.id;

        const productData = await Product.findById(productId);
        const categoryData = await Category.find({ is_blocked: false });

        if (req.session.user) {
            const userData = req.session.user;
            const userId = userData._id;
            const user = await User.findOne({ _id: userId }).populate("cart.product").lean();

            let cartId = null;

            if (user.cart && user.cart.length > 0) {
                cartId = user.cart[0]._id;

                if (!productData) {
                    res.render("404", { userData });
                } else res.render("productView", { productData, cartId, categoryData, userData });
            } else {
                res.render("productView", { productData, categoryData, userData });
            }
        } else {
            if (!productData) {
                res.render("404", { categoryData });
            } else res.render("productView", { productData, categoryData });
        }
    } catch (error) {
        console.log(error.message);
        const userData = req.session.user;
        const categoryData = await Category.find({ is_blocked: false });
        res.render("404", { userData, categoryData });
    }
};

module.exports = {
    loadAllProducts,
    loadProducts,
    productView,
    offerProducts,


    categoryFilter,
    subCategoryFilter,
    brandFilter,
    sortProduct,
};
