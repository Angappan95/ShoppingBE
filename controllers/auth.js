const User = require("../models/user")
const {validationResult} = require("express-validator")
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

exports.signup = (req, res) => {
    var errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(422).json({
            parameter: errors.array()[0].param,
            error: errors.array()[0].msg
        })
    }

    const user = new User(req.body)
    user.save((err, user) => {
        if (err){
            return res.status(400).json({
                "err": "wrong inputs"
            })
        } else {
            // console.log(user)
            return res.status(201).json({
                data: {
                    name: user.name,
                    last_name: user.lastname,
                    mail: user.email,
                    role: user.role
                },
                created_time: user.createdAt
            })
        }
    })
}

exports.signin = (req, res) => {
    const {email, password} = req.body
    errors = validationResult(res)
    
    // Handling JS validation errors
    if (!errors.isEmpty()){
        return res.status(401).json({
            param: errors.array()[0].param,
            error: errors.array()[0].err
        })
    }

    User.findOne({email}, (err, user) => {
        // Handling SQL exception thrown by Mongo db
        if (err) {
            return res.status(400).json({
                error: err
            })
        }

        // Handling error when the given user is not present in the db
        if (!user) {
            return res.status(400).json({
                error: "User not found"
            })
        }

        //  Handling error when the password doesn't match
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Invalid password"
            })
        }

        // Generate token and set it to cookie
        const token = jwt.sign({_id: user._id}, process.env.SECRET)
        res.cookie("token", token, {expire: new Date() + 999})

        // Destructing values from the 'user' object
        const {_id, name, email, role} = user

        return res.json({
            token,
            user: {_id, name, email, role}
        })
    }) 
}


exports.signout = (req, res) => {
    res.clearCookie('token')
    res.json({
        'message': 'User Signed-out successfully'
    })
}

// Protected
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth" // Setting the auth property only when the user is signed in with proper credentials
})

exports.isAuthorized = (req, res, next) => {
    // 1. check if req.profile is passed from the FE, 
    // 2. check if we have req.auth property set in the middleware
    // 3. check if value of '_id' property in 'profile' is equal to auth._id set by the middleware
    let authorized = req.profile && req.auth && req.profile._id == req.auth._id 

    if (!authorized){
        res.status(403).json({
            error: "ACCESS DENIED"
        })
    }
    next()
}

exports.isAdmin = (req, res, next) => {
    // Check if the profile passed from the FE has the Admin role. 
    // Assuming that 0 is a normal user and 1 is a Admin user
    if (req.profile.role === 0){
        return res.status(403).json({
            error: "ACESS DENIED: Not a Admin User"
        })
    }
    next()
}