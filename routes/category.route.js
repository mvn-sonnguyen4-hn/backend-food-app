const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { isAdmin } = require("../utils/auth");
router.get("/", isAdmin, categoryController.getAllCategories);

router.post("/create", isAdmin, categoryController.createCategory);

module.exports = router;
