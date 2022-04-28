const orderSchema = require("../models/order.model");
const { pagination } = require("../utils/functions");

// get all orders
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const user_id = req.user_id;
    if (!user_id) {
      res.status(400).json({ msg: "Not authorize" });
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
const getOrderByUserId = async (req, res) => {
  try {
    const total = await orderSchema
      .find({ user: req.user_id })
      .countDocuments();
    if(total===0){
      return res.json({
        status: 200,
        data: [],
        page:0,
        totalPage:0,
      });
    }
    const { status, page, totalPage } = pagination(
      req.query.page ?? 1,
      10,
      total
    );
    if (status === 500) {
      return res.status(status).json({ msg: "pagiantion is error" });
    }
    const order = await orderSchema
      .find({ user: req.user_id })
      .skip((page - 1) * 10)
      .limit(10)
      .sort({ createdAt: -1 })
      .populate("foods.food")
      .populate("user");
    if (order) {
      res.json({
        status: status,
        data: order,
        page,
        totalPage,
      });
    } else {
      res.status(500).json({ msg: "not found order" });
    }
  } catch {
    res.status(500).json({ msg: "Server wrong" });
  }
};

// create order
const createOrder = async (req, res) => {
  const { listFood, address, phonenumber, user_id, fullname } = req.body;
  if (!listFood.length) {
    res.status(500).json({ msg: "Food is required" });
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
    user: user_id || null,
    foods,
    fullname,
    address,
    phonenumber,
  });
  newOrder.save((err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ msg: "Action is error" });
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
  getOrderByUserId,
  deleteOrdersByUser,
};
