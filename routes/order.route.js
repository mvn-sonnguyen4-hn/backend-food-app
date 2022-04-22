const express=require('express')
const router=express.Router();
const orderController=require('../controllers/order.controller');
const { isAuth, isAdmin } = require('../utils/auth');
router.get('/',isAuth,orderController.getOrderByUserId)
router.post('/create',isAuth,orderController.createOrder)
router.put('/update',isAuth,orderController.updateOrder)
router.post('/delete',isAuth,orderController.deleteOrders)

module.exports=router