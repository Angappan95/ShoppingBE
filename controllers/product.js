const Product = require('../models/product')
const formidable = require('formidable')
const fs = require('fs')
const _ = require('lodash')

exports.createProduct = (req, res) => {
    let form = formidable.IncomingForm()
    form.keepExtension = true

    form.parse(req, (err, fields, file)=> {
        if (err) {
            return res.status(400).json({
                error: "ERROR: Unable to parse Form data",
                stack: err
            })
        }

        let product = new Product(fields)
        const {name, description, price, category, photo} = product
        
        // Validation the inpcoming field values
        if (!name || !description || !price || !category|| !photo){
            return res.status(400).json({
                error: "ERROR: One or more of the mandatory fields are missing",
                mandatory_fields: "name, description, price, category and photo",
                data: product
            })
        }
        
        // Handling file
        if (file.photo) {
            if (file.photo.size > (3 * 1024 * 1024)) {
                // If incoming photo size is > 3 MB
                return res.status(400).json({
                    error: "ERROR: Upload photo size which is less than 3 MB"
                })
            }
            // Read the photo & data type from 'form-data' and assign it to 'product' object
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.ContentType = file.photo.type
        }

        // Save the product to DB
        product.save((err, prod) => {
            if (err) {
                return res.status(400).json({
                    error: "ERROR: Unable to save the product",
                    message: err
                })
            }

            // We dont want to show the photo buffered value in the response.
            const {name, description, price, category} = prod
            res.status(200).json({
                message: "Product saved sucessfully",
                product: {
                    name: name,
                    description: description,
                    price: price,
                    category: category
                }
            })
        })
    }) 
}

exports.getProductById = (req, res, next, productId) => {
    Product.findById(productId, (err, product)=> {
        if (err) {
            return res.status(400).json({
                error: "ERROR: Unable to fetch the product",
                message: err
            })
        }
        req.product = product
        next()
    })
}

exports.getProduct = (req, res) => {
    const {name, description, price, category} = req.product
    return res.status(200).json({
        product: {
            name: name,
            description: description,
            price: price,
            category: category
        }
    })
}

exports.getPhoto = (req, res, next) => {
    if(req.product.photo.data){
        res.set("Content-Type", req.product.photo.ContentType)
        return res.send(req.product.photo.data)
    }
    next()
}

exports.getAllProducts = (req, res) => {

    let limit = req.query.limit ? parseInt(req.query.limit) : 10
    let sortBy = req.query.sortby ? req.query.soryby : "_id"

    Product.find({})
    .select("-photo") // Select the product by excluding photo field
    .populate("category")
    .limit(limit)
    .sort([[sortBy, "asc"]])
    .exec((err, products) => {
        if (err) {
            return res.status(400).json({
                error: "ERROR: Unable to retrive product list from DB",
                message: err
            })
        }
        return res.status(200).json({
            data: products
        })
    })
}

exports.updateProduct = (req, res) => {
    let product = req.product
    let form = formidable.IncomingForm()
    form.keepExtension = true

    form.parse(req, (err, fields, file) => {
        if (err) {
            res.status(400).json({
                error: "ERROR: Unable to psrse the form-data"
            })
        }

    // Get the product information from the middleware and update it with new value from form-data
    let product = req.product
    product = _.extend(product, fields)
    })

    // saving to db
    product.save(product, (err, prod) => {
        if (err) {
            return res.status(200).json({
                error: "ERROR: Could not update the product information",
                stack: err
            })
        }
        res.status(200).json({
            message: "Product updated successfully",
            data: prod
        })
    })
}

exports.getUniqueCategories = (req, res) => {
    Product.distinct("category", {})
        .populate("category")
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: "ERROR: Unable to fetch unique categories in Product Table"
                })
            }
            res.status(200).json({
                data: result
            })
        })
}

exports.updateSoldQty = (req, res, next) => {
    let customOperations = eq.body.products.map(item => {
        return {
                updateOne: {
                    filter: {_id: item._id},
                    update: {$inc: {stock: -prod.count, sold: +prod.count}}
            }
        }
    })
        
    Product.bulkWrite(customOperations, (err, result)=> {
        if (err) {
            return res.status(400).json({
                error: "ERROR: Issue with bulk update"
            })
        }
        next()
    })
}

exports.deleteProduct = (req, res) => {
    let product = req.product
    product.remove((err, product) => {
        if (err) {
            return res.status(400).json({
                error: "Unable to delete the product",
                stack: err
            })
        }
        return res.status(200).json({
            message: "Product is deleted successfully"
        })
    })
}