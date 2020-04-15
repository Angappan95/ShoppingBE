const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema

const productCartSchema = mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "Product"
    },
    quantity: Number,
    total_price: Number,
}, {
    timestamps: true
})

const productCart = mongoose.model("ProductCart", productCartSchema)

const orderSchema = mongoose.Schema({
    products: [productCartSchema],
    transaction_id: Number,
    amount: Number,
    address: String,
    status: {
        type: String,
        default: "RECIEVED",
        enum: ["RECIEVED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"]
    },
    updatedTime: Date,
    user: {
        type: ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

const order = mongoose.model("Order", orderSchema)

module.exports = {order, productCart}