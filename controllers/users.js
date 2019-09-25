const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    /*if (body.password === undefined) {
      return response.status(400).json ({ error: 'password is missing.' })
    }*/

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    if (body.username === undefined) {
      return response.status(400).json({ error: 'username is missing.' })
    } else if (body.username.length < 3) {
      return response.status(400).json ({ error: 'username must be at least 3 characters' })
    } else if (body.password.length < 3) {
      return response.status(400).json ({ error: 'password must be more than 3 characters' })
    }

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

usersRouter.get('/', async (request, response) => {
  try{
    const users = await User.find({}).populate('blogs', { title: 1, date: 1 })

    response.json(users.map(u => u.toJSON()))
  } catch (exception) {
    response(exception)
  }

})

module.exports = usersRouter
