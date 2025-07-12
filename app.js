const express = require("express");
// require("express-async-errors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const middleware = require("./utils/middleware");
const blogsRouter = require("./controllers/blogs");
const UsersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const app = express();

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch(error => {
    logger.error("error connection to MongoDB:", error.message);
  });

// app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);
app.use(middleware.userExtractor);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", UsersRouter);
app.use("/api/login", loginRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
