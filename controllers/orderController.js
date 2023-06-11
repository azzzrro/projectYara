const User = require("../models/userModel");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Address = require("../models/addressModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel")
const moment = require('moment')
const Razorpay = require('razorpay')

require('dotenv').config();


////////////////////ORDER CONTROLLERS/////////////////////////////



const placeOrder = async (req,res)=>{
    try {

        const userData = req.session.user
        const userId = userData._id
        const addressId = req.body.selectedAddress
        const amount = req.body.amount
        const paymentMethod = req.body.selectedPayment
        const couponData = req.body.couponData

        const user = await User.findOne({ _id: userId }).populate("cart.product")
        const userCart = user.cart

        let subTotal = 0

        userCart.forEach((item)=>{
            item.total = item.product.price * item.quantity
            subTotal += item.total
        })

        let productData = userCart.map(item =>{
            return{
                id       : item.product._id,
                name     : item.product.name,
                category : item.product.category,
                subCategory : item.product.subCategory,
                price    : item.product.price,
                quantity : item.quantity,
                image    : item.product.imageUrl[0],
            }
        })
        
        const result = Math.random().toString(36).substring(2,7)
        const id = Math.floor(100000 + Math.random() * 900000)
        const orderId = result + id

        let saveOrder = async ()=>{
            if(couponData){
                
                const order = new Order({
                    userId: userId,
                    product: productData,
                    address: addressId,
                    orderId: orderId,
                    total: amount,
                    paymentMethod: paymentMethod,
                    discountAmount: couponData.discountAmount,
                    amountAfterDiscount: couponData.newTotal,
                    couponName : couponData.couponName

                })

                const orderSuccess = await order.save()
            }else{

                const order = new Order({
                    userId: userId,
                    product: productData,
                    address: addressId,
                    orderId: orderId,
                    total: subTotal,
                    paymentMethod: paymentMethod
                })

                const orderSuccess = await order.save()
            }

            let userDetails = await User.findById(userId)
            let userCartDetails = userDetails.cart

            userCartDetails.forEach( async item=>{
                const productId = item.product
                const quantity = item.quantity

                const product = await Product.findById(productId)
                const stock = product.stock
                const updatedStock = stock - quantity

                await Product.findByIdAndUpdate(
                    productId,
                    { $set: { stock: updatedStock, isOnCart: false } },
                    { new: true }
                )
            })

            userDetails.cart = []
            await userDetails.save()
        }

        if(addressId){
            if(paymentMethod === "Cash On Delivery"){
                
                saveOrder()

                res.json({
                    order: "Success"
                })
            }
            else if(paymentMethod === "Razorpay"){

                var instance = new Razorpay({
                    key_id: process.env.RAZORPAY_KEY_ID,
                    key_secret: process.env.RAZORPAY_KEY_SECRET,
                });

                const order = await instance.orders.create({
                    amount: amount*100,
                    currency: 'INR',
                    receipt: 'Yara SkinCare'

                })

                saveOrder()

                res.json({
                    order: "Success"
                })

            }
            else if(paymentMethod === 'Wallet'){
                try{

                    const walletBalance = req.body.walletBalance
                    
                    await User.findByIdAndUpdate(userId,
                        { $set: { wallet: walletBalance }}, { new: true })

                    saveOrder()

                    res.json({
                        order: "Success"
                    })

                }catch(error){
                    console.log(error.message);
                }
            }
        }

    } catch (error) {
        console.log(error.message);
    }
}





const orderSuccess = async(req,res)=>{
    try {
        
        const userData = req.session.user
        const categoryData = await Category.find({ is_blocked: false });

        res.render('orderSuccess', {userData, categoryData})


    } catch (error) {
        console.log(error.message);
    }
}


const myOrders = async(req,res)=>{
    try {

        const page = parseInt(req.query.page) || 1
        const ordersPerPage = 6
        const skip = (page - 1) * ordersPerPage
        
        
        const userData = req.session.user
        const userId = userData._id

        const categoryData = await Category.find({ is_blocked: false });
        
        const orders = await Order.find({ userId })
            .sort({ date: -1 })
            .skip(skip)
            .limit(ordersPerPage)

        const totalCount = await Order.countDocuments({ userId })
        const totalPages = Math.ceil(totalCount / ordersPerPage)

        const formattedOrders = orders.map(order =>{
            const formattedDate = moment(order.date).format('MMMM D, YYYY')
            return { ...order.toObject(), date: formattedDate }
        })

        res.render('myOrders', {
            userData, 
            categoryData, 
            myOrders: formattedOrders || [],
            currentPage: page,
            totalPages
        })


    } catch (error) {
        console.log(error.message);
    }
}


const orderDetails = async(req,res)=>{
    try {

        const userData = req.session.user
        const orderId = req.query.orderId

        const categoryData = await Category.find({ is_blocked: false });
       
        const orderDetails = await Order.findById(orderId)
        .populate({
          path: 'product',
          populate: [
            { path: 'category', model: 'category' },
            { path: 'subCategory', model: 'SubCategory' }
          ]
        })        
        const orderProductData = orderDetails.product
        const addressId = orderDetails.address
        

        const address = await Address.findById(addressId)
        

        
        res.render('orderDetails', { 
            userData, 
            categoryData, 
            orderDetails, 
            orderProductData, 
            address })
        
    } catch (error) {
        console.log(error.message);
    }
}


const filterOrder = async(req,res)=>{
    try {

        const status = req.query.status
        const userData = req.session.user
        const userId = userData._id

        const orders = await Order.find({ userId, status: status }).sort({ date: -1 })

        const formattedOrders = orders.map(order=>{
            const formattedDate = moment(order.date).format("MMMM D YYYY")
            return { ...order.toObject(), date: formattedDate }
        })

        res.json(formattedOrders)
        
    } catch (error) {
        console.log(error.message);
    }
}


const updateOrder = async (req, res) => {
    try {
        const userData = req.session.user;
        const userId = userData._id;

        const orderId = req.query.orderId;
        const status = req.body.orderStatus;
        const paymentMethod = req.body.paymentMethod;
        const updatedBalance = req.body.wallet;

        
        if (paymentMethod !== "Cash On Delivery") {
            await User.findByIdAndUpdate(userId, { $set: { wallet: updatedBalance } }, { new: true });

            if (status === "Returned") {
                await Order.findByIdAndUpdate(orderId, { $set: { status: status } });
                res.json({ 
                    message: "Returned",
                    refund: "Refund"
                });
            }
            if (status === "Cancelled") {
                await Order.findByIdAndUpdate(orderId, { $set: { status: status } });
                res.json({ 
                    message: "Cancelled",
                    refund: "Refund"
                });
            }
        } else if(paymentMethod == "Cash On Delivery" && status === "Returned") {
            
            await User.findByIdAndUpdate(userId, { $set: { wallet: updatedBalance } }, { new: true });

            await Order.findByIdAndUpdate(orderId, { $set: { status: status } });
                res.json({ 
                    message: "Returned",
                    refund: "Refund"
                });

        }else if(paymentMethod == "Cash On Delivery" && status === "Cancelled"){
            
            await Order.findByIdAndUpdate(orderId, { $set: { status: status } });
                res.json({ 
                    message: "Returned",
                    refund: "No Refund"
                });
        }
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    orderSuccess,
    myOrders,
    placeOrder,
    orderDetails,
    filterOrder,
    updateOrder
}
