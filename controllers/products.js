const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");


////////////////////Products/////////////////////////////

const loadProducts = async (req, res) => {
    try {
        const userData=req.session.user
        const categoryId = req.query.id;
        const productData = await Product.find({ category: categoryId });
        const categoryData = await Category.find(); 


        if(!productData){
          res.render('404',{userData})
        }

        res.render("products", { productData,categoryData, userData });
    } catch (error) {
        console.log(error.message);
        res.render('404',{userData})
    }
};

const productView = async (req, res) => {
    try {
        
        const userData=req.session.user
        const productId = req.query.id;
        const productData = await Product.findById(productId);
        const categoryData = await Category.find(); 


        if(!productData){
          res.render('404',{userData})
        }else

        res.render("productView", { productData, categoryData, userData });


    } catch (error) {
        console.log(error.message);
        res.render('404',{userData})

    }
};


module.exports={
    loadProducts,
    productView
}