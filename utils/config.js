require('dotenv').config()
console.log(process.env.MONGODB_URI)
console.log(process.env.PORT)

let PORT = process.env.PORT
let MONGODB_URI = process.env.MONGODB_URI


module.exports = {
  MONGODB_URI,
  PORT
}
