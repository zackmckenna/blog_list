const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./test_helper')


describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})

describe('When invalid users are created', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test('When no username is submitted', async () => {
    const noUsername = {
      user: "test",
      password: "test"
    }

    let response = await api
      .post('/api/users')
      .send(noUsername)

    expect(response.text).toContain('username is missing.')
  })

  test('When username is too short', async () => {
    const shortUsername = {
      username: "No",
      user: "test",
      password: "test"
    }

    let response = await api
      .post('/api/users')
      .send(shortUsername)

    expect(response.text).toContain('username must be at least 3 characters')
  })
  test('When no password is submitted.', async () => {
    const shortUsername = {
      username: "test",
      user: "test",
    }

    let response = await api
      .post('/api/users')
      .send(shortUsername)

    expect(response.text).toContain('password is missing.')
  })

  test('When password submitted is too short', async () => {
    const shortUsername = {
      username: "test",
      user: "test",
      password: "no"
    }

    let response = await api
      .post('/api/users')
      .send(shortUsername)

    expect(response.text).toContain('password must be more than 3 characters')
  })
})

afterAll(() => {
  mongoose.connection.close()
})
