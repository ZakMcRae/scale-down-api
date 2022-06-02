const { beforeAll, beforeEach, afterAll } = require("@jest/globals");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

require("dotenv").config({
  path: "./test/test.env",
});

let mongoServer, mongoUri;

// before all tests - setup and connect to new in memory database
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  mongoUri = mongoServer.getUri();
  mongoose.connect(mongoUri);
  mongoose.connection.on("error", (e) => {
    if (e.message.code === "ETIMEDOUT") {
      console.log(e);
      mongoose.connect(mongoUri);
    }
    console.log(e);
  });
});

beforeEach(async () => {
  // drop collections before each test - stops unwanted side effects between tests
  const collections = Object.keys(mongoose.connection.collections);
  collections.map(async (collection) => {
    await mongoose.connection.collections[collection].deleteMany();
  });
});

// after all tests - close and stop in memory database
afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});
