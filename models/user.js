const crypto = require("crypto")
const mongoose = require("mongoose")
const uuidv1 = require('uuid/v1')

const Schema = mongoose.Schema



var userSchema = Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    lastname: {
        type: String,
        required: false,
        maxlength: 32,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    userInfo: {
        type: String,
        trim: true
    },
    passwordHash: String,
    salt: String,
    role:{
        type: Number,
        default: 0
    },
    purchase:{
        type: Array,
        default: []
    }
}, {
    timestamps: true
}, { 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }}
)

userSchema.virtual("password")
  .set(function(val) {
    this._password = val;
    this.salt = uuidv1();
    this.passwordHash = this.getHashedPwd(val);
  });

userSchema.methods = {
    getHashedPwd: function(pwd){
        return crypto.createHmac('sha256', this.salt)
        .update(pwd).digest('hex')
    },
    authenticate: function(pwd){
        return this.getHashedPwd(pwd) === this.passwordHash
    }
}

module.exports = mongoose.model("User", userSchema)