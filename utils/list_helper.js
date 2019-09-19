/*const lodash = require('lodash')*/

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs === undefined || blogs.length === 0){
    return 0
  }
  const reducer = (accumulator, currentValue) => accumulator + currentValue
  const blogLikes = blogs.map(blog => {
    return blog.likes
  })
  return blogLikes.reduce(reducer)
}

const favoriteBlog = (blogs) => {
  if (blogs === undefined || blogs.length === 0){
    return 'No blogs found'
  }
  const favoriteBlogObject =  blogs.reduce((prev,current) => {
    return (prev.likes > current.likes) ? prev : current
  })
  return (
    {
      title: favoriteBlogObject.title,
      author: favoriteBlogObject.author,
      likes: favoriteBlogObject.likes
    }
  )
}

/*const mostBlogs = (blogs) => {

}

const mostLikes = (blogs) => {

}*/

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
  /*mostBlogs*/
}
