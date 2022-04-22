const orderSchema = require("../models/order.model");
const userSchema = require("../models/user.model");
const foodSchema = require("../models/food.model");
const getOrderByUserId = async (req, res) => {
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
    .sort({ createdAt: -1 });
  const totalOrder = await orderSchema.find({}).countDocuments();
  const totalPage = Math.ceil(totalOrder / limit);

  let data = {
    foods: [],
    user: null,
    status: "",
    createdAt: "",
  };
  const listOrders = [];
  for await (const order of orders) {
    const user = await userSchema.findOne({ _id: order.user });
    for await (const food of order.foods) {
      const f = await foodSchema.findOne({ _id: food.food });
      let item = {
        food: f,
        amount: food.amount,
        note: food.note,
        _id: food._id,
      };
      if (f) {
        data.foods.push(item);
      }
    }
    data.user = user;
    data.status = order.status;
    data.createdAt = order.createdAt;
    data._id = order._id;
    listOrders.push(data);
    data = {
      foods: [],
      user: null,
      status: "",
      createdAt: "",
    };
  }
  if (orders) {
    res.json({
      status: 200,
      data: listOrders,
      page,
      totalPage,
    });
  } else {
    res.status(500).json({ msg: "Error" });
  }
};

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

module.exports = { getOrderByUserId, createOrder, updateOrder, deleteOrders };
