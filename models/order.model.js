const mongoose = require("mongoose");
const OrderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  foods: [
    {
      food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
});
const Order = (module.exports = mongoose.model("Order", OrderSchema));