const _ = require("lodash");

const dummy = blogs => {
  return 1;
};

const totalLikes = blogs => {
  return blogs.reduce((total, blog) => total + blog.likes, 0);
};

const favoriteBlog = blogs => {
  if (blogs.length === 0) return null;
  return blogs.find(
    blog => blog.likes === Math.max(...blogs.map(blog => blog.likes))
  );
};

const mostBlogs = blogs => {
  if (blogs.length === 0) return null;
  const countBlogs = _.map(_.countBy(blogs, "author"), (key, value) => {
    return {
      author: value,
      blogs: key,
    };
  });
  const chosenAuthor = _.maxBy(countBlogs, "blogs");
  return chosenAuthor;
};

const mostLikes = blogs => {
  if (blogs.length === 0) return null;
  const newBlogs = _.reduce(
    blogs,
    function (array, blog) {
      const { author, likes } = blog;
      const isExisted = _.find(array, blog => blog.author == author);
      const obj = isExisted || { author, likes: 0 };
      obj.likes += likes;
      if (!isExisted) {
        array.push(obj);
      }
      return array;
    },
    []
  );
  const author = _.maxBy(newBlogs, blog => blog.likes);
  return author;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
