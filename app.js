const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const { engine } = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo').default
const connectDB = require('./config/db')
// const { default: mongoose } = require('mongoose')

// LOAD Config
dotenv.config({path: './config/config.env'})

// PASSPORT Config
require('./config/passport')(passport)

connectDB()

const app = express()

// Body Parser
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Handlebars Helper
const { formatDate, stripTags, truncate, editIcon } = require('./helpers/hbs')

// Handlebars
app.engine('.hbs', engine({
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon
    },
    defaultLayout: 'main',
    extname: '.hbs'
}))
app.set('view engine', '.hbs')

// Session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
})
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// STATIC folder
app.use(express.static(path.join(__dirname, 'public')))

// ROUTES
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000


app.listen(
    PORT, 
    console.log(`Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`))