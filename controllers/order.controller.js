const orderSchema = require("../models/order.model");

// get all orders
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const user_id = req.user_id;
    if (!user_id) {
      res.status(500).json({ msg: "Error" });
      return;
    }
    const orders = await orderSchema
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("foods.food")
      .populate("user");
    const totalOrder = await orderSchema.find({}).countDocuments();
    const totalPage = Math.ceil(totalOrder / limit);
    if (orders) {
      return res.json({
        status: 200,
        data: orders,
        page,
        totalPage,
      });
    }
    res.status(500).json({ msg: "Error" });
  } catch {
    res.status(500).json({ msg: "Error" });
  }
};


// get order by id
const getOrderById = async (req, res) => {
  try {
    const _id = req.params.id;
    const order = await orderSchema
      .find({ user: _id })
      .populate("foods.food")
      .populate("user");
    if (order) {
      res.json({
        status: 200,
        data: order,
      });
    } else {
      res.status(500).json({ msg: "Error" });
    }
  } catch {
    res.status(500).json({ msg: "Error" });
  }
};

// create order
const createOrder = async (req, res) => {
  const { listFood, status } = req.body;
  const user_id = req.user_id;
  if (!listFood.length) {
    res.status(500).json({ msg: "Error" });
    return;
  }
  const foods = listFood.map((order) => {
    return {
      food: order.food,
      amount: order.amount,
      note: order?.note ?? "",
    };
  });
  const newOrder = new orderSchema({
    user: user_id,
    foods,
    status,
  });
  newOrder.save((err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ msg: "Error" });
    } else {
      res.json({
        status: 200,
        data,
      });
    }
  });
};

// update order
const updateOrder = async (req, res) => {
  const { _id, listFood, status } = req.body;
  if (!listFood.length) {
    res.status(500).json({ msg: "Error" });
    return;
  }
  const foods = listFood.map((order) => {
    return {
      food: order.food,
      amount: order.amount,
      note: order?.note ?? "",
    };
  });
  const order = await orderSchema.findOne({ _id });
  if (order) {
    order.foods = foods;
    order.status = status;
    order.save((err, data) => {
      if (err) {
        console.log(err);
        res.status(500).json({ msg: "Error" });
      } else {
        res.json({
          status: 200,
          data,
        });
      }
    });
    return;
  }
  res.status(500).json({ msg: "Error" });
};

// delete order
const deleteOrders = async (req, res) => {
  try {
    const { id_orders } = req.body;
    id_orders.forEach(async (_id) => {
      await orderSchema.deleteOne({ _id });
    });
    res.status(200).json(true);
  } catch {
    res.status(500).json({ msg: "Error" });
  }
};

// delete order by user
const deleteOrdersByUser = async (req, res) => {
  try {
    if (!req.user_id) {
      return res.status(500).json({ msg: "Error" });
    }
    const { id_orders } = req.body;
    const result = await orderSchema.deleteMany({
      _id: { $in: id_orders },
      user: req.user_id,
    });
    if (result.acknowledged) {
      return res.status(200).json({
        msg: true,
      });
    }
  } catch {
    res.status(500).json({ msg: "Error" });
  }
};

module.exports = {
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrders,
  getOrderById,
  deleteOrdersByUser,
};
