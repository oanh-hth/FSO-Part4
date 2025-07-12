const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blogs");

const api = supertest(app);

describe("there is some blogs at the beginning", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test("unique identifier property of the blog posts is named id", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body[0].id, helper.initialBlogs[0]._id);
  });
});

describe("work with authorized user", () => {
  let headers;
  beforeEach(async () => {
    let user = {
      username: "root",
      password: "secret",
    };

    const loginUser = await api.post("/api/login").send(user);

    headers = {
      Authorization: `bearer ${loginUser.body.token}`,
    };
  });

  test("create a new blog", async () => {
    const newBlog = {
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
    };
    await api
      .post("/api/blogs")
      .set(headers)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);

    const titles = response.map(r => r.title);
    assert.strictEqual(titles.includes(newBlog.title), true);
  });

  // test("added a blog without likes", async () => {
  //   const newBlog = {
  //     title: "A blog with no likes",
  //     author: "Anonymous",
  //     url: "butter.com",
  //   };

  //   const result = await api
  //     .post("/api/blogs")
  //     .send(newBlog)
  //     .set(headers)
  //     .expect(201)
  //     .expect("Content-Type", /application\/json/);

  //   assert.strictEqual(result.body.likes, 0);
  // });

  // test("adding a blog without title", async () => {
  //   const newBlog = {
  //     author: "Hippo",
  //     url: "acnn.net",
  //     likes: 1,
  //   };

  //   await api.post("/api/blogs").set(headers).send(newBlog).expect(400);

  //   const response = await helper.blogsInDb();
  //   assert.strictEqual(response.length, helper.initialBlogs.length);
  // });

  // test("adding a blog if token is not provided", async () => {
  //   const newBlog = {
  //     title: "A blog with no likes",
  //     author: "Anonymous",
  //     url: "butter.com",
  //   };

  //   await api.post("/api/blogs").send(newBlog).expect(401);
  // });

  // test("delete a blog", async () => {
  //   const blogs = await helper.blogsInDb();
  //   const deleteBlog = blogs[0];
  //   await api.delete(`/api/blogs/${deleteBlog.id}`).set(headers).expect(204);
  //   const response = await helper.blogsInDb();
  //   assert.strictEqual(response.length, helper.initialBlogs.length - 1);
  // });

  // test("update a blog", async () => {
  //   const blogs = await helper.blogsInDb();
  //   const updatedBlog = blogs[0];
  //   updatedBlog.likes = 2;

  //   await api
  //     .put(`/api/blogs/${updatedBlog.id}`)
  //     .send(updatedBlog)
  //     .set(headers)
  //     .expect("Content-Type", /application\/json/);

  //   const response = await helper.blogsInDb();
  //   assert.strictEqual(response[0].likes, updatedBlog.likes);
  // });
});

after(async () => {
  await mongoose.connection.close();
});
