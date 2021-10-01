const User = require("../../models/user");

const addFakeUser = async () => {
  const user = new User({
    userName: "matt",
    hashedPassword: process.env.TEST_HASHED_PASSWORD,
    _id: "61547b22c7c5959e24db1b8e",
  });
  await user.save();

  return User;
};

module.exports = { addFakeUser };
