const foodSchema = require("../models/food.model");
const categorySchema = require("../models/category.model");
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

const createFood = (req, res) => {
  const { name, price, url_img, description, avaiable, category_id } = req.body;
  if ((!name, !price, !url_img, description, !avaiable, !category_id)) {
    res.json({
      status: 500,
      msg: "Error",
    });
  }
  try {
    const newFood = new foodSchema({
      name,
      price,
      url_img,
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
module.exports = { getFoodByPaginationAndCategory, createFood };
