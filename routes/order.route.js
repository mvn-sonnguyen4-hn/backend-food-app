const express=require('express')
const router=express.Router();
const orderController=require('../controllers/order.controller');
const { isAuth, isAdmin } = require('../utils/auth');
router.post('/',isAuth,orderController.getOrderByUserId)
router.post('/create',isAuth,orderController.createOrder)

module.exports=router