const mongoose = require("mongoose");
const messageSchema=require("../models/message.model");
const userSchema=require("../models/user.model");
const RoomSchema = mongoose.Schema({
  messages: [
    {
      message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: messageSchema,
      },
    },
  ],
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: userSchema,
    },
  ],
  status: {
    type: Number,
    default: 0,
  },
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
const Room = (module.exports = mongoose.model("Room", RoomSchema));