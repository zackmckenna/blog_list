const config = require('./utils/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(bodyParser.json())

/*logger.info('connecting to', config.MONGODB_URI)*/

const mongoUrl = process.env.MONGODB_URI

mongoose.connect(mongoUrl, { useNewUrlParser: true })
  .then(result => {
    logger.info('Connected to MongoDB', result)
  })
  .catch((error => {
    logger.info('error connecting to MongoDB:', error)
  }))

app.use(cors())
app.use(express.static('build'))

app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

module.exports = app
