const foodSchema = require("../models/food.model");
const getAllFood = (req, res) => {
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
  const { name, price, url_img, description,avaiable } = req.body;
  const newFood = new foodSchema({
    name,
    price,
    url_img,
    description,
    avaiable
  });
  newFood.save((err, data) => {
    console.log(err)
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
}
module.exports = { getAllFood,createFood };
