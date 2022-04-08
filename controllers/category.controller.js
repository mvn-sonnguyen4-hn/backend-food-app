const categorySchema = require("../models/category.model");
const getAllCategories = async (req, res) => {
  const categories = await categorySchema.find({});
  if (categories) {
    res.json({
      status: 200,
      data: categories,
    });
  }
  else{
      res.status(500).json({ msg: "Error" });
  }
};
const createCategory = async (req, res) => {
  const { name } = req.body;
  if (name) {
    const newCategory = new categorySchema({
      name,
    });
    newCategory.save((err, data) => {
      if (err) {
        res.status(500).json({ msg: "Error" });
      } else {
        res.json({
          status: 200,
          data,
        });
      }
    });
  }
  else{
    res.status(500).json({ msg: "Error" });
  }
};

module.exports = { getAllCategories, createCategory };
