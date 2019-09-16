require('dotenv').config()
const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

console.log(process.env.MONGODB_URI)

const mongoUrl = process.env.MONGODB_URI

mongoose.connect(mongoUrl, { useNewUrlParser: true })
    .then(result => {
        console.log('Connected to MongoDB')
    })
    .catch((error => {
        console.log('error connecting to MongoDB:', error)
    }))

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)


app.use(cors())
app.use(bodyParser.json())

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.put('/api/blogs/:id', (request, response) => {
    const body = request.body

    if (body.name === undefined) {
      return response.status(400).json({ error: 'name is missing' })
    }

    if (body.title === undefined) {
      return response.status(400).json({ error: 'title is missing' })
    }

    const blog = {
      name: body.name,
      number: body.number,
    }

    Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    .then(updatedBlog => {
      response.json(updatedPerson.toJSON())
      })
    .catch(error => {
      console.log(error)
    })
    })

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
