const config = require('./utils/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const mongoose = require('mongoose')

console.log('connecting to', config.MONGODB_URI)

const mongoUrl = process.env.MONGODB_URI

mongoose.connect(mongoUrl, { useNewUrlParser: true })
  .then(result => {
    console.log('Connected to MongoDB')
  })
  .catch((error => {
    console.log('error connecting to MongoDB:', error)
  }))

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())

app.use('/api/blogs', blogsRouter)

module.exports = app
