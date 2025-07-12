const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const helper = require("./test_helper");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe("total likes", () => {
  const listWithOneBlog = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
      likes: 5,
      __v: 0,
    },
  ];

  test("of empty list is zero", () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test("of a bigger list is calculated right", () => {
    const result = listHelper.totalLikes(helper.initialBlogs);
    assert.strictEqual(result, 36);
  });
});

describe("favorite blog", () => {
  test("of a bigger list is calculated right", () => {
    const result = listHelper.favoriteBlog(helper.initialBlogs);
    assert.deepStrictEqual(result, helper.initialBlogs[2]);
  });

  test("of empty list is null", () => {
    const result = listHelper.favoriteBlog([]);
    assert.strictEqual(result, null);
  });
});

describe("the author has most blogs", () => {
  test("of a bigger list is calculated right", () => {
    const result = listHelper.mostBlogs(helper.initialBlogs);
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3,
    });
  });

  test("of empty list is null", () => {
    const result = listHelper.mostBlogs([]);
    assert.strictEqual(result, null);
  });
});

describe("the author with most likes", () => {
  test("of a bigger list is calculated right", () => {
    const result = listHelper.mostLikes(helper.initialBlogs);
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });

  test("of empty list is null", () => {
    const result = listHelper.mostLikes([]);
    assert.strictEqual(result, null);
  });
});
