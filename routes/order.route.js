const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { isAuth, isAdmin } = require("../utils/auth");

// admin
router.get("/admin", isAdmin, orderController.getAllOrders);
router.put("/admin/update", isAdmin, orderController.updateOrder);
router.post("/admin/delete", isAdmin, orderController.deleteOrders);

// user
router.post("/create", orderController.createOrder);
router.put("/update", isAuth, orderController.updateOrder);
router.post("/delete", isAuth, orderController.deleteOrdersByUser);
router.get("/user", isAuth, orderController.getOrderByUserId);
module.exports = router;
