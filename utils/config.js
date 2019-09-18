require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI

if (process.env.NODE_ENV === 'test') {
  console.log('equal to test')
  MONGODB_URI = process.env.TEST_MONGODB_URI
}

console.log(`Running on database ${MONGODB_URI}`)

module.exports = {
  MONGODB_URI,
  PORT
}
