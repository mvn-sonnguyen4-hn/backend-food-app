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
  const { user_id, list_orders } = req.body;
  if (!user_id || (!list_orders && list_orders.length)) {
    res.status(500).json({ msg: "Error" });
    return;
  }
  const newOrder = new orderSchema({
    user: user_id,
    foods: list_orders,
  });
  newOrder.save((err, data) => {
    if (err) {
      res.status(500).json({ msg: "Error" });
    } else {
      res.json({
        status: 200,
        data,
      });
    }
  });
};

module.exports = { getOrderByUserId ,createOrder};
