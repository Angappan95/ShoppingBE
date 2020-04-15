const Category = require("../models/category")

exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err) {
            return res.status(400).json({
                error: "ERROR: Category not found in DB",
                message: err
            })
        }
        req.category = category //Create an object category under request and assign it with the result from 'findbyId' call
        next()
    })
}


exports.createCategory = (req, res) => {
    const myCategory = new Category(req.body)
    myCategory.save((err, category) => {
         if(err) {
             return res.status(400).json({
                 error: "ERROR: Unable to save the Category in DB"
             })
         } 
         return res.status(201).json({category})
     })
}

exports.getCategory = (req, res) => {

    return res.status(200).json(req.category)

    /* const {_id, name, description} = req.category

    Category.findById(_id, (err, category) => {
        if (err) {
            return res.status(400).json({
                error: "ERROR: Unable to get Category from DB"
            })
        }
        return res.status(200).json({
            data: {
                category: name,
                description: description
            }
        })
    }) */

    // Since this logic is already implemented in getCategoryById middleware, we can reuse it
    
    return res.status(200).json(req.category)
}


exports.getAllCategories = (req, res) => {
    Category.find({}, (err, categories) => {
        if (err || !categories) {
            return res.status(400).json({
                error: "ERROR: Unable to get Categories from DB",
                message: err
            })
        }
        category_list = []
        categories.forEach(category => {
            const {name, description} = category
            category_list.push({
                category: name,
                description: description
            })
        })
        return res.status(200).json(category_list)
    })
}

exports.updateCategory = (req, res) => {
    let category = req.category // Property From the middleware component getCategorybyId
    category.name = req.body.name // Assign the category 'name' from the request body to the category property
    
    // Update the category changes to the mongo DB
    category.save((err, updatedCategory) => {
        if (err) {
            return res.status(400).json({
                error: "ERROR: Could not update the Category"
            })
        }
        return res.status(200).json({
            message: "Category updated sucessfuly",
            data: updatedCategory
        })
    })
}

exports.deleteCategory = (req, res) => {
    let category = req.category
    /*
    Category.deleteOne({name: category.name}, (err, updatedCategory) => {
        if (err) {
            return res.status(400).json({
                error: "ERROR: Could not delete the Category"
            })
        }
        return res.status(200).json({
            message: "Category is delted successfuly"
        })
    })
    */

    category.remove((err, category) => {
        if (err) {
            return res.status(400).json({
                error: "ERROR: Could not delete the Category"
            })
        }
        return res.status(200).json({
            message: "Category is deleted successfuly"
        })
    })
}