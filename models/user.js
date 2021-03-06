var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);
