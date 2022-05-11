const categorySchema = require("../models/category.model");
const getAllCategories = async (req, res) => {
  try {
    const categories = await categorySchema.find({});
    if (categories) {
      res.json({
        status: 200,
        data: categories,
      });
    }
  } catch {
    res.status(500).json({ msg: "Error" });
  }
};
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (name) {
      const oldCategory = await categorySchema.findOne({ name });
      if (oldCategory) {
        res.status(500).json({ msg: "Category existed" });
        return;
      }
      const newCategory = new categorySchema({
        name,
      });
      newCategory.save((err, data) => {
        if (err) {
          return res.status(500).json({ msg: "Error" });
        }
        res.status(200).json(data);
      });
    } else {
      res.status(500).json({ msg: "Error" });
    }
  } catch {
    res.status(500).json({ msg: "Error" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    if (name && id) {
      await categorySchema.findOneAndUpdate({ _id: id }, { name });
    }
    return res.status(200).json({ msg: "Success" });
  } catch (err) {
    res.status(500).json({ msg: new Error(err).message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      await categorySchema.findOneAndDelete({ _id: id });
    }
    return res.status(200).json({ msg: "Success" });
  } catch (err) {
    res.status(500).json({ msg: new Error(err).message });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
