const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const { isAuth, isAdmin } = require("../utils/auth");

// admin
router.get("/:id",isAuth, messageController.getMessageByUserId);
router.get("/rooms/:id",isAdmin, messageController.getRoomsByAdmin);

module.exports = router;
