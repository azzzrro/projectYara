const mongoose = require("../config/mongo");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    mobile: {
        type: Number,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    is_blocked: {
        type: Boolean,
        required: true,
    },

    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],

    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
                default: 1,
            },
        },
    ],

    wallet: {
        balance: {
            type: Number,
            default: 0,
        },
        transactions: [
            {
                date: {
                    type: Date,
                },
                details: {
                    type: String,
                },
                amount: {
                    type: Number,
                },
                status: {
                    type: String,
                },
            },
        ],
    },

    referralCode: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("User", userSchema);
