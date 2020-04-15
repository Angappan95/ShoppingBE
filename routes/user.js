const express = require("express")
const {check} = require('express-validator')
const {getUserById, getUser, updateUser, getAllUsers, getUserPurchaseList} = require("../controllers/user")
const {isSignedIn, isAuthorized} = require("../controllers/auth")


const router = express.Router()

router.param('userId', getUserById)

router.get('/user/:userId', isSignedIn, isAuthorized, getUser)

router.put('/user/:userId', isSignedIn, isAuthorized, updateUser)

router.get('/users/all', getAllUsers)

router.get('/orders/user/:userId', getUserPurchaseList)

module.exports = router