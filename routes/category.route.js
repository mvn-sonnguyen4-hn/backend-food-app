const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { isAdmin,isAuth } = require("../utils/auth");
router.get("/", categoryController.getAllCategories);

router.post("/create", isAdmin, categoryController.createCategory);

module.exports = router;
