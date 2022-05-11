const foodSchema = require("../models/food.model");
const categorySchema = require("../models/category.model");
const { streamUpload } = require("../utils/upload");

// get food
const getFoodByPaginationAndCategory = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, keyword = "" } = req.query;
    let search = {
      name: { $regex: keyword, $options: "$i" },
    };
    if (type) {
      const category = await categorySchema.findOne({ name: type });
      if (category && category._id) {
        search = { ...search, category: category._id };
      }
    }
    const listFood = await foodSchema
      .find(search)
      .skip((page - 1) * limit)
      .limit(limit);
    const totalFood = await foodSchema.find(search).countDocuments();
    const totalPage = Math.ceil(totalFood / limit);
    res.status(200).json({
      data: listFood,
      totalPage,
      page,
      limit,
    });
  } catch {
    res.status(500).json({ msg: "Err" });
  }
};

// create food
const createFood = async (req, res) => {
  const result = await streamUpload(req);
  if (!result) {
    return res.status(500).json({ msg: "Err" });
  }
  const { name, price, description = "", category_id } = req.body;
  if (!name || !price || !category_id) {
    res.json({
      status: 500,
      msg: "Field is required",
    });
  }
  try {
    const newFood = new foodSchema({
      name,
      price,
      url_img: result.url,
      description,
      category: category_id,
    });
    newFood.save((err, data) => {
      if (err) {
        res.json({
          status: 500,
          msg: "Error when save file",
        });
      } else {
        res.json({
          status: 200,
          data,
        });
      }
    });
  } catch (err) {
    res.json({
      status: 500,
      msg: "Server error",
    });
  }
};

// delete food
const deleteFood = async (req, res) => {
  try {
    const { ids } = req.body;
    await foodSchema.deleteMany({
      _id: {
        $in: ids,
      },
    });
    res.status(200).json({ msg: "Success" });
  } catch {
    res.status(500).json({ msg: "Error" });
  }
};

// update food
const updateFood = async (req, res) => {
  try {
    const { name, price, description, avaiable, category_id, url_img } =
      req.body;
    if (!name || !price || !category_id) {
      return res.status(500).json({ msg: "Field is required" });
    }
    const { id } = req.params;
    const food = await foodSchema.findById(id);
    if (!food) {
      return res.status(500).json({ msg: "Not found" });
    }
    let result = "";
    if (!url_img) {
      try {
        result = await streamUpload(req);
      } catch (err) {
        return res.status(500).json({ msg: err });
      }
      if (!result) {
        return res.status(500).json({ msg: "Server is err" });
      }
    }
    food.name = name;
    food.price = price;
    food.description = description;
    food.avaiable = avaiable;
    food.category = category_id;
    food.url_img = url_img || result.url;
    await food.save();
    res.status(200).json({ data: food });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

module.exports = {
  getFoodByPaginationAndCategory,
  createFood,
  updateFood,
  deleteFood,
};
