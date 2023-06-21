const User = require("../models/userModel");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Address = require("../models/addressModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const moment = require("moment");
const path = require('path')
const puppeteer = require('puppeteer')
const Razorpay = require("razorpay");

require("dotenv").config();

////////////////////ORDER CONTROLLERS/////////////////////////////

const placeOrder = async (req, res) => {
    try {
        const userData = req.session.user;
        const userId = userData._id;
        const addressId = req.body.selectedAddress;
        const amount = req.body.amount;
        const paymentMethod = req.body.selectedPayment;
        const couponData = req.body.couponData;

        const user = await User.findOne({ _id: userId }).populate("cart.product");
        const userCart = user.cart;

        let subTotal = 0;
        let offerDiscount = 0

        userCart.forEach((item) => {
            item.total = item.product.price * item.quantity;
            subTotal += item.total;
        });

        userCart.forEach((item) => {
            if(item.product.oldPrice > 0){
            item.offerDiscount = (item.product.oldPrice - item.product.price) * item.quantity
            offerDiscount += item.offerDiscount;
            }
        });

        let productData = userCart.map((item) => {
            return {
                id: item.product._id,
                name: item.product.name,
                category: item.product.category,
                subCategory: item.product.subCategory,
                price: item.product.price,
                oldPrice: item.product.oldPrice,
                quantity: item.quantity,
                image: item.product.imageUrl[0].url,
            };
        });

        const result = Math.random().toString(36).substring(2, 7);
        const id = Math.floor(100000 + Math.random() * 900000);
        const orderId = result + id;

        let saveOrder = async () => {

            const ExpectedDeliveryDate = new Date()
            ExpectedDeliveryDate.setDate(ExpectedDeliveryDate.getDate() + 3 )

            if (couponData) {
                const order = new Order({
                    userId: userId,
                    product: productData,
                    address: addressId,
                    orderId: orderId,
                    total: amount,
                    ExpectedDeliveryDate: ExpectedDeliveryDate,
                    offerDiscount: offerDiscount,
                    paymentMethod: paymentMethod,
                    discountAmount: couponData.discountAmount,
                    amountAfterDiscount: couponData.newTotal,
                    couponName: couponData.couponName,
                });

                await order.save();

                const couponCode = couponData.couponName
                await Coupon.updateOne({ code: couponCode }, { $push: { usedBy: userId } })

                
            } else {
                const order = new Order({
                    userId: userId,
                    product: productData,
                    address: addressId,
                    orderId: orderId,
                    total: subTotal,
                    ExpectedDeliveryDate: ExpectedDeliveryDate,
                    offerDiscount: offerDiscount,
                    paymentMethod: paymentMethod,
                });

                const orderSuccess = await order.save();
            }

            let userDetails = await User.findById(userId);
            let userCartDetails = userDetails.cart;

            userCartDetails.forEach(async (item) => {
                const productId = item.product;
                const quantity = item.quantity;

                const product = await Product.findById(productId);
                const stock = product.stock;
                const updatedStock = stock - quantity;

                await Product.findByIdAndUpdate(
                    productId,
                    { $set: { stock: updatedStock, isOnCart: false } },
                    { new: true }
                );
            });

            userDetails.cart = [];
            await userDetails.save();
        };

        if (addressId) {
            if (paymentMethod === "Cash On Delivery") {

                saveOrder();               
                req.session.checkout =false
                
                res.json({
                    order: "Success",
                });
                
            } else if (paymentMethod === "Razorpay") {
                var instance = new Razorpay({
                    key_id: process.env.RAZORPAY_KEY_ID,
                    key_secret: process.env.RAZORPAY_KEY_SECRET,
                });

                const order = await instance.orders.create({
                    amount: amount * 100,
                    currency: "INR",
                    receipt: "Yara SkinCare",
                });

                saveOrder();
                req.session.checkout =false

                res.json({
                    order: "Success",
                });
                
            } else if (paymentMethod === "Wallet") {
                try {
                    const walletBalance = req.body.walletBalance;

                    await User.findByIdAndUpdate(userId, { $set: { "wallet.balance": walletBalance } }, { new: true });
                    
                    const transaction = {
                        date: new Date(),
                        details: `Confirmed Order - ${orderId}`,
                        amount: subTotal,
                        status: "Debit",
                    };

                    await User.findByIdAndUpdate(userId, { $push: { "wallet.transactions": transaction } }, { new: true })

                    saveOrder();
                    req.session.checkout =false

                    res.json({
                        order: "Success",
                    });
                } catch (error) {
                    console.log(error.message);
                }
            }
        }
    } catch (error) {
        console.log(error.message);
    }
};

const orderSuccess = async (req, res) => {
    try {
        const userData = req.session.user;
        const categoryData = await Category.find({ is_blocked: false });

        res.render("orderSuccess", { userData, categoryData });
    } catch (error) {
        console.log(error.message);
    }
};

const myOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const ordersPerPage = 6;
        const skip = (page - 1) * ordersPerPage;

        const userData = req.session.user;
        const userId = userData._id;

        const categoryData = await Category.find({ is_blocked: false });

        const orders = await Order.find({ userId }).sort({ date: -1 }).skip(skip).limit(ordersPerPage);

        const totalCount = await Order.countDocuments({ userId });
        const totalPages = Math.ceil(totalCount / ordersPerPage);

        const formattedOrders = orders.map((order) => {
            const formattedDate = moment(order.date).format("MMMM D, YYYY");
            return { ...order.toObject(), date: formattedDate };
        });

        res.render("myOrders", {
            userData,
            categoryData,
            myOrders: formattedOrders || [],
            currentPage: page,
            totalPages,
        });
    } catch (error) {
        console.log(error.message);
    }
};

const orderDetails = async (req, res) => {
    try {
        const userData = req.session.user;
        const orderId = req.query.orderId;

        const categoryData = await Category.find({ is_blocked: false });

        const orderDetails = await Order.findById(orderId).populate({
            path: "product",
            populate: [
                { path: "category", model: "category" },
                { path: "subCategory", model: "SubCategory" },
            ],
        });
        const orderProductData = orderDetails.product;
        const addressId = orderDetails.address;

        const address = await Address.findById(addressId);

        res.render("orderDetails", {
            userData,
            categoryData,
            orderDetails,
            orderProductData,
            address,
        });
    } catch (error) {
        console.log(error.message);
    }
};

const filterOrder = async (req, res) => {
    try {
        const status = req.query.status;
        const userData = req.session.user;
        const userId = userData._id;

        const orders = await Order.find({ userId, status: status }).sort({ date: -1 });

        const formattedOrders = orders.map((order) => {
            const formattedDate = moment(order.date).format("MMMM D YYYY");
            return { ...order.toObject(), date: formattedDate };
        });

        res.json(formattedOrders);
    } catch (error) {
        console.log(error.message);
    }
};

const updateOrder = async (req, res) => {
    try {
        const userData = req.session.user;
        const userId = userData._id;

        const orderId = req.query.orderId;
        const status = req.body.orderStatus;
        const paymentMethod = req.body.paymentMethod;
        const updatedBalance = req.body.wallet;
        const total = req.body.total

        const order = await Order.findOne({ _id: orderId })
        const orderIdValue = order.orderId

        if (paymentMethod !== "Cash On Delivery") {
            await User.findByIdAndUpdate(userId, { $set: { "wallet.balance": updatedBalance } }, { new: true });
        

            if (status === "Returned") {
                await Order.findByIdAndUpdate(orderId, { $set: { status: status, }, $unset: { ExpectedDeliveryDate: "" } });

                const transaction = {
                    date: new Date(),
                    details: `Returned Order - ${orderIdValue}`,
                    amount: total,
                    status: "Credit",
                };
                
                await User.findByIdAndUpdate(userId, { $push: { "wallet.transactions": transaction } }, { new: true })


                res.json({
                    message: "Returned",
                    refund: "Refund",
                });
            }
            if (status === "Cancelled") {
                await Order.findByIdAndUpdate(orderId, { $set: { status: status, }, $unset: { ExpectedDeliveryDate: "" } });

                const transaction = {
                    date: new Date(),
                    details: `Cancelled Order - ${orderIdValue}`,
                    amount: total,
                    status: "Credit",
                };
                
                await User.findByIdAndUpdate(userId, { $push: { "wallet.transactions": transaction } }, { new: true })


                res.json({
                    message: "Cancelled",
                    refund: "Refund",
                });
            }
        } else if (paymentMethod == "Cash On Delivery" && status === "Returned") {
            
            await User.findByIdAndUpdate(userId, { $set: { "wallet.balance": updatedBalance } }, { new: true });

            
            const transaction = {
                date: new Date(),
                details: `Returned Order - ${orderIdValue}`,
                amount: total,
                status: "Credit",
            };
            
            await User.findByIdAndUpdate(userId, { $push: { "wallet.transactions": transaction } }, { new: true })

            await Order.findByIdAndUpdate(orderId, { $set: { status: status, }, $unset: { ExpectedDeliveryDate: "" } });
            res.json({
                message: "Returned",
                refund: "Refund",
            });
        } else if (paymentMethod == "Cash On Delivery" && status === "Cancelled") {
            await Order.findByIdAndUpdate(orderId, { $set: { status: status, }, $unset: { ExpectedDeliveryDate: "" } });
            res.json({
                message: "Cancelled",
                refund: "No Refund",
            });
        }
    } catch (error) {
        console.log(error.message);
    }
};



const downloadInvoice = async(req,res)=>{
    try {

        const orderId = req.query.orderId
        const orderData = await Order.findById(orderId)
        const browser = await puppeteer.launch({ headless:false })
        const page = await browser.newPage()

        await page.goto(`https://www.yaraskin.shop/invoice?orderId=${orderId}`, {
            waitUntil: "networkidle2",
        });

        const todayDate = new Date()

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
          });

        await browser.close()

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=${orderData.orderId}Invoice.pdf`,
          });

        res.send(pdfBuffer);

        
    } catch (error) {
        console.log(error.message);
    }
}

const invoice = async(req,res)=>{
    try {

        const orderId = req.query.orderId
        const orderData = await Order.findById(orderId)

        const { userId, address: addressId } = orderData;
        
        const [userData, addressData] = await Promise.all([
            User.findById(userId),
            Address.findById(addressId),
        ]);

        
        const productData = orderData.product.map((product) => {
            const totalPrice = product.oldPrice ? product.quantity * product.oldPrice : product.quantity * product.price;
          
            return {
              quantity: product.quantity.toString(),
              name: product.name,
              price: product.price,
              oldPrice: product.oldPrice,
              totalPrice: totalPrice,
            };
          });
          


          const subTotal = orderData.product.reduce((total, product) => {
            const price = product.oldPrice ? product.oldPrice : product.price;
            return total + price * product.quantity;
          }, 0);
          

        const orderDate = moment(orderData.date).format('MMMM D, YYYY')
        const invoiceDate = moment(new Date()).format('MMMM D, YYYY')

        res.render('invoice',{userData, orderData, productData, subTotal, addressData, orderDate, invoiceDate })


    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    orderSuccess,
    myOrders,
    placeOrder,
    orderDetails,
    filterOrder,
    updateOrder,
    downloadInvoice,
    invoice
};
