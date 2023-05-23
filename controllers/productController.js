const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const User = require("../models/userModel")

////////////////////Products/////////////////////////////

const loadAllProducts = async (req, res) => {
    try {
        if (req.session.user) {
            const userData = req.session.user;
            const categoryData = await Category.find({ is_blocked: false });
            const productData = await Product.find();

            res.render("products", { userData, productData, categoryData });
        } else {
            const categoryData = await Category.find({ is_blocked: false });
            const productData = await Product.find();

            res.render("products", { productData, categoryData });
        }
    } catch (error) {
        console.log(error.message);
        const userData = req.session.user;
        res.render("404", { userData });
    }
};

const loadProducts = async (req, res) => {
    try {
        const userData = req.session.user;
        const categoryId = req.query.id;
        const productData = await Product.find({ category: categoryId });
        const categoryData = await Category.find({ is_blocked: false });

        if (!productData) {
            res.render("404", { userData });
        }

        res.render("products", { productData, categoryData, userData });
    } catch (error) {
        console.log(error.message);
        const userData = req.session.user;
        res.render("404", { userData });
    }
};

const productView = async (req, res) => {
    try {
        const userData = req.session.user;
        const userId = userData._id
        const productId = req.query.id;

        const productData = await Product.findById(productId);
        const categoryData = await Category.find({ is_blocked: false });

        const user = await User.findOne({ _id: userId }).populate("cart.product").lean();
        const cart = user.cart;



        if (!productData) {
            res.render("404", { userData });
        } else res.render("productView", { productData, cart, categoryData, userData });
    } catch (error) {
        console.log(error.message);
        const userData = req.session.user;
        res.render("404", { userData });
    }
};

module.exports = {
    loadAllProducts,
    loadProducts,
    productView,
};
