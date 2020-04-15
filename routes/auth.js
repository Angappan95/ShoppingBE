const express = require("express")
const router = express.Router()
const expressJwt = require("express-jwt")
const {check, validationResult} = require('express-validator')
const {signup, signin, signout, isSignedIn} = require("../controllers/auth")

router.post('/signup', [
    check("name", "Name should be of length > 3").isLength({min: 3}),
    check("email", "Provide proper email id").isEmail(),
    check("password", "Password should be of length > 5").isLength({min: 3})
], signup)

router.post('/signin', [
    check("email", "Provide proper email id").isEmail(),
    check("password", "Provide valid password").isLength({min: 3})
], signin)

router.get('/signout', signout)

// Test route for protected middleware
router.get('/testRoute', isSignedIn, (req, res)=>{
    res.json({
        msg: "Accessed a protected route"
    })
})

module.exports = router