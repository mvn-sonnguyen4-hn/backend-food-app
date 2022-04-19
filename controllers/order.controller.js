const orderSchema = require("../models/order.model");
const getOrderByUserId = async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    res.status(500).json({ msg: "Error" });
    return;
  }
  const orders = await orderSchema.find({ user: user_id });
  if (orders) {
    res.json({
      status: 200,
      data: orders,
    });
  } else {
    res.status(500).json({ msg: "Error" });
  }
};

const createOrder = async (req, res) => {
  const { data } = req.body;
  if (!req.user_id || !(data && data.length)) {
    res.status(500).json({ msg: "Error" });
    return;
  }
  const foods = data.map((order) => {
    return {
      food: order.food,
      amount: order.amount,
      note: order?.note ?? "",
    };
  });
  const newOrder = new orderSchema({
    user: req.user_id,
    foods,
  });
  newOrder.save((err, data) => {
    if (err) {
      console.log(err)
      res.status(500).json({ msg: "Error" });
    } else {
      res.json({
        status: 200,
        data,
      });
    }
  });
};

module.exports = { getOrderByUserId, createOrder };
