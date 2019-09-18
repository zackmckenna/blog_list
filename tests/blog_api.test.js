const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[2])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[3])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[4])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[5])
  await blogObject.save()
})

test('All blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(helper.initialBlogs.length)
})

test('GET request to /api/blogs should return blogs.', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
})

test('All blogs returned in JSON format', async () => {
  await api
    .get('/api/blogs')
    .expect('Content-Type', /application\/json/)
})

test('Verify that blogs have id property.', async () => {
  let response = await api
    .get('/api/blogs')
  console.log(response.body[0].id)
  expect(response.body[0].id).toBeDefined()
})

test('POST request adds a new blog post.', async () => {
  let blogToPost = new Blog(
    {
      _id: "5a422bc61b54a676234d17f3",
      title: "New Blog",
      author: "Zack",
      url: "http://blog.newblog.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }
  )
  await blogToPost.save()

  let response = await api
    .get('/api/blogs')

  expect(response.body.length).toBe(helper.initialBlogs.length + 1)
  expect(response.body[response.body.length-1]).toStrictEqual({
    id: "5a422bc61b54a676234d17f3",
    title: "New Blog",
    author: "Zack",
    url: "http://blog.newblog.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  })
})

afterAll(() => {
  mongoose.connection.close()
})
