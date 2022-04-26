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
  const { name, price, description, avaiable, category_id } = req.body;
  if (!name || !price || !avaiable || !category_id) {
    res.json({
      status: 500,
      msg: "Error",
    });
  }
  try {
    const newFood = new foodSchema({
      name,
      price,
      url_img: result.url,
      description,
      avaiable,
      category: category_id,
    });
    newFood.save((err, data) => {
      if (err) {
        res.json({
          status: 500,
          msg: "Error",
        });
      } else {
        res.json({
          status: 200,
          data,
        });
      }
    });
  } catch {
    res.json({
      status: 500,
      msg: "Error",
    });
  }
};

// delete food
const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await foodSchema.findById(id);
    if (!food) {
      return res.status(500).json({ msg: "Not found" });
    }
    await food.remove();
    res.status(200).json({ msg: "Success" });
  } catch {
    res.status(500).json({ msg: "Error" });
  }
};

// update food
const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await foodSchema.findById(id);
    if (!food) {
      return res.status(500).json({ msg: "Not found" });
    }
    const { name, price, description, avaiable, category_id, url_img } =
      req.body;
    let result = "";
    if (!url_img) {
      try{
        result = await streamUpload(req);
      }
      catch(err){
        return res.status(500).json({ msg: "Err" });
      }
      if (!result) {
        return res.status(500).json({ msg: "Err" });
      }
    }
    if (!name || !price || !avaiable || !category_id) {
      return res.status(500).json({ msg: "Field is required" });
    }
    food.name = name;
    food.price = price;
    food.description = description;
    food.avaiable = avaiable;
    food.category = category_id;
    food.url_img = url_img || result.url;
    await food.save();
    res.status(200).json({ data:food});
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
