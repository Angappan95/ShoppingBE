const express = require('express')
const router = express.Router()

const {getUserById} = require('../controllers/user')
const {isSignedIn, isAuthorized, isAdmin} = require('../controllers/auth')
const {createProduct, getProductById, getProduct, getPhoto, updateProduct, getAllProducts, getUniqueCategories, deleteProduct} =require('../controllers/product')

// Params for Category
router.param("userId", getUserById)
router.param("productId", getProductById)

// Routers
router.post('/product/create/:userId', isSignedIn, isAuthorized, isAdmin, createProduct)

router.get('/product/get/:productId', getProduct)

router.get('/product/photo/:productId', getPhoto)

router.get("/products/all", getAllProducts)

router.put("/product/update/:productId/:userId", isSignedIn, isAuthorized, isAdmin, updateProduct)

router.get("/product/categories/unique", getUniqueCategories)

router.delete("/product/delete/:productId/:userId", isSignedIn, isAuthorized, isAdmin, deleteProduct)

module.exports = router;