const express = require("express");
const router = express.Router();
const { isAuth } = require("../utils/auth");
const userController = require("../controllers/user.controller");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("file");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.put("/update", isAuth, upload, userController.updateUser);

router.get("/auto-login", userController.autoLoginUser);
router.get("/getAdmin", userController.getAdmin);

module.exports = router;
