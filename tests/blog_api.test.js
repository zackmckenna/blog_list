const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
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
  expect(response.body[0].id).toBeDefined()
})

test('POST request adds a new blog post.', async () => {
  let blogToPost = new Blog(
    {
      title: "New Blog",
      author: "Zack",
      url: "http://blog.newblog.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
    }
  )
  await api
    .post('/api/blogs')
    .send(blogToPost)
    .expect(200)


  let response = await api
    .get('/api/blogs')

  expect(response.body.length).toBe(helper.initialBlogs.length + 1)
  expect(response.body[response.body.length-1].author).toBe(
    "Zack"
  )
})

test('If there are no likes or if it is missing, it will set to a default of 0.', async () => {
  let blogToPost = new Blog(
    {
      title: "New Blog",
      author: "Zack",
      url: "http://blog.newblog.com/uncle-bob/2016/05/01/TypeWars.html",
    }
  )
  await api
    .post('/api/blogs')
    .send(blogToPost)
    .expect(200)

  let response = await api
    .get('/api/blogs')
  expect(response.body[response.body.length-1].likes).toBe(0)
})

test('If post request does not contain title and url properties, respond with 400', async () => {
  let blogToPost = new Blog({
    author: "zack"
  })

  await api
    .post('/api/blogs')
    .send(blogToPost)
    .expect(400)
})

test('Request blog by id', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blogToFind = blogsAtStart[0]

  const response = await api
    .get(`/api/blogs/${blogToFind.id}`)
    .expect(200)

  expect(response.body).toEqual(blogToFind)
})

test('DELETE request deletes blog.', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAfterDelete = await helper.blogsInDb()

  expect(blogsAtStart.length).toBe(blogsAfterDelete.length+1)

  const titles = blogsAfterDelete.map(r => r.title)

  expect(titles).not.toContain(blogToDelete.title)
})

afterAll(() => {
  mongoose.connection.close()
})
