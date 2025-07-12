const jwt = require("jsonwebtoken");
const blogsRouter = require("express").Router();
const Blog = require("../models/blogs");
const User = require("../models/users");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }
  const user = request.user;
  if (!user) {
    return response.status(401).json({ error: "unauthorized" });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id,
    likes: body.likes,
  });

  if (blog.likes === undefined) {
    blog.likes = 0;
  }

  const result = await blog.save();

  user.blogs = user.blogs.concat(result._id);
  await user.save();

  response.status(201).json(result);
});

blogsRouter.delete("/:id", async (request, response) => {
  const user = request.user;
  if (!user) {
    response.status(401).json({
      error: "token missing or invalid",
    });
  }
  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() === user._id.toString()) {
    await Blog.deleteOne(blog);
    response.status(204).end();
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
  };
  const result = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(result);
});

module.exports = blogsRouter;
