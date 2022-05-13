const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");
const uploadForUpdate = multer({ storage: storage }).single("recfile");
const foodController = require("../controllers/food.controller");

const { isAuth, isAdmin } = require("../utils/auth");
router.get("/", foodController.getFoodByPaginationAndCategory);
router.post("/create", isAdmin, upload, foodController.createFood);
router.put("/update/:id", isAdmin, uploadForUpdate, foodController.updateFood);
router.delete("/delete", isAdmin, foodController.deleteFood);

module.exports = router;
