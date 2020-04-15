const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
require('dotenv').config()
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const orderRoutes = require('./routes/order')

// PORT
const app = express()
const port = process.env.PORT || 8000

// Middleware
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

// My routes
app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', categoryRoutes)
app.use('/api', productRoutes)
app.use('/api', orderRoutes)

// DB Conection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(()=> {
    console.log("DB connected")
}).catch((err)=> console.log(`ERROR ${err.stack}`))


// Starting the node server
app.listen(port, () => {
    console.log(`App started on PORT ${port}`)
})