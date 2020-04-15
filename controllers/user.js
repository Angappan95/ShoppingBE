const User = require('../models/user')
const Order = require('../models/order')
const {validationResult} = require('express-validator')

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) =>{
        if (err || !user){
            return res.status(400).json({
                error: "User not found"
            })
        } 
        req.profile = user
        next()
    } )
}

exports.getUser = (req, res) => {
    const {_id, name, email, role} = req.profile // Deconstructing user profile
    return res.json({
        id: _id,
        name: name,
        email: email,
        role: role
    })
}

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, useFindAndModify: false},
        (err, user) => {
            if (err){
                return res.status(400).json({
                    error: "ERROR"
                })
            }

            const {_id, name, email, role} = user
            return res.status(200).json({
                data: {
                    id: _id,
                    name: name,
                    email: email,
                    role: role
                }
            })
        }
        )
}

exports.getAllUsers = (req, res) => {
    User.find({}, '_id name email role', (err, users) => {
        if (err || !users){
            return res.status(400).json({
                error: "DB Error",
                desc: err
            })
        }

        return res.status(200).json({
            data: users
        })
    })
}

exports.getUserPurchaseList = (req, res) => {
    Order.find({user: req.profile.id}).populate("User", "_id name email role").exec((err, orders) => {
        if(err) {
            return res.status(400).json({
                error: "Mongoose ERROR"
            })
        } 
        return res.status(200).json({
            data: orders
        })
    })
}

exports.pushOrderToPurchaseList = (req, res, next) => {
    let purchases = []

    req.body.order.products.forEach(product => {
        purchases.push({
            _id: product.id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id
        })
    });

    // Store the purchased product details to the corresponding user
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {purchase: purchases}}, // Update the purchase field of corresponding user with the purchases list which we have captured above
        {new: true}, (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: "Unable to update the purchase list"
                })
            }
        }
    )
    next()
}