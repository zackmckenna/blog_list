const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]

const title = process.argv[3]
const author = process.argv[4]
const blogUrl = process.argv[5]
const likes = process.argv[6]

const url =
    `mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/blog-list?retryWrites=true`

// eslint-disable-next-line no-undef
mongoose.connect(url, { useNewUrlParser: true })

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
  title: title,
  author: author,
  blogUrl: blogUrl,
  likes: likes,
})

blog.save().then(result => {
  console.log(`${author}'s blog, ${title} has been added to the database. It has ${likes} likes.`)
  console.log(result)
  mongoose.connection.close()
})

Blog.find({}).then(result => {
  result.forEach(blog => {
    console.log(blog)
  })
  mongoose.connection.close
})
