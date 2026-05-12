const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const { engine } = require('express-handlebars')
const connectDB = require('./config/db')

// LOAD Config
dotenv.config({path: './config/config.env'})

connectDB()

const app = express()

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Handlebars
app.engine('.hbs', engine({
    defaultLayout: 'main',
    extname: '.hbs'
}))
app.set('view engine', '.hbs')

// STATIC folder
app.use(express.static(path.join(__dirname, 'public')))

// ROUTES
app.use('/', require('./routes/index'))

const PORT = process.env.PORT || 3000


app.listen(
    PORT, 
    console.log(`Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`))