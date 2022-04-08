const foodSchema = require("../models/food.model");
const getFoodByPaginationAndCategory = (req, res) => {
  foodSchema.find({}, (err, data) => {
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
