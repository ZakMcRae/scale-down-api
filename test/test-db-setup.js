const { beforeAll, afterAll } = require("@jest/globals");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

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
  mongoose.connection.once("open", () => {
    console.log(`MongoDB successfully connected to ${mongoUri}`);
  });
});

// after all tests - close and stop in memory database
afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});