const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
  firtst_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phonenumber: {
    type: Number,
    required: true,
  },
  adress: {
    type: String,
    required: false,
  },
  role: {
    type: Number,
    default: 1,
  },
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
const User = (module.exports = mongoose.model("User", UserSchema));
