const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const User = require("../models/users");

const api = supertest(app);

describe("there is some users at the beginning", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("secret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("users are returned as json", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});

describe("creation of new user", () => {
  test("add new valid user", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(result.body.error, "username must be unique");
    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with proper statuscode and message if username is less than 3 characters long", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "ro",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert(
      result.body.error.includes("shorter than the minimum allowed length (3)")
    );
    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails with proper statuscode and message if password is less than 3 characters long", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "roooot",
      name: "Superuser",
      password: "sa",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(
      result.body.error,
      "password must be at least 3 characters long"
    );
    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(() => {
  mongoose.connection.close();
});
