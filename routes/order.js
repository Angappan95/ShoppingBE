const express = require('express')
const router = express.Router()

const {isSignedIn, isAuthorized, isAdmin} = require('../controllers/auth')
const {getUserById, pushOrderToPurchaseList, getUserPurchaseList} = require('../controllers/user')
const {getProduct, getProductById, updateSoldQty} = require('../controllers/product')
const {getOrderById, createOrder, getAllOrders, getOrderStatus, updateOrderStatus} = require('../controllers/order')

// Param
router.param('userId', getUserById)

router.param('orderId', getOrderById)

// Routes
router.post('order/create/:userId', isSignedIn, isAuthorized, pushOrderToPurchaseList, updateSoldQty, createOrder)

router.get('order/all', getAllOrders)

router.get('order/status/:orderId', isSignedIn, isAuthorized, getOrderStatus)

router.put('order/status/:orderId/:userId', isSignedIn, isAuthorized, isAdmin, updateOrderStatus)

module.exports = router