const express = require('express')
const router = express.Router()

const {createCategory, getCategoryById, getCategory, getAllCategories, updateCategory, deleteCategory} = require('../controllers/category')
const {getUserById} = require('../controllers/user')
const {isSignedIn, isAuthorized, isAdmin} = require('../controllers/auth')
const {createProduct} =require('../controllers/product')

// Params for Category
router.param("userId", getUserById)
router.param("categoryId", getCategoryById)

// Routers
router.post("/category/create/:userId", isSignedIn, isAuthorized, isAdmin, createCategory)

router.get("/category/:categoryId", getCategory)

router.get("/categories/all", getAllCategories)

router.put("/category/:categoryId/:userId", isSignedIn, isAuthorized, isAdmin, updateCategory)

router.delete("/category/:categoryId/:userId", isSignedIn, isAuthorized, isAdmin, deleteCategory)

// router.post("/product/create/:userId", isSignedIn, isAuthorized, isAdmin, createProduct)


module.exports = router;
