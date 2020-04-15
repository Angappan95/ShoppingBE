const {Order, ProductCart} = require('../models/order')


exports.getOrderById = (req, res, next, id) => {
    Order.findById(id)
        .populate("products.product", "name  price")
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: 'ERROR: Unable to retrive Order',
                    stack: err
                })
            }
            req.order = result
            next();
        })
}

exports.createOrder = (req, res) => {
    req.body.order.user = req.profile
    const order = new Order(req.body.order)

    order.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: 'ERROR: Unable to save the Order to DB',
                stack: err
            })
        }
        res.status(200).json({
            data: result
        })
    })
}

exports.getAllOrders = (req, res) => {
    Order.find({})
        .populate('order', '_id name')
        .exec((err, results) => {
            if (err) {
                return res.status(400).json({
                    error: "ERROR: Unable to fetch the Orders detail from DB",
                    stack: err
                })
            }
            res.status(200).json({
                data: results
            })
        })
}

exports.getOrderStatus = (req, res) => {
    const order = req.order
    res.status(200).json({
        orderId: order.id,
        status: order.status
    }) 
}

exports.updateOrderStatus = (req, res) => {
    Order.update(
        {_id: req.body.order.id},
        {$set: {status: req.body.status}}
    ).exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: "ERROR: Unable to update the Order status to DB",
                stack: err
            })
        }
        res.status(200).json({
            message: 'Order status is updated sucessfuly',
            data: result
        })
    })
}