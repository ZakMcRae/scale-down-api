var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
});

// todo add recently used fooditems array per user

module.exports = mongoose.model("User", UserSchema);