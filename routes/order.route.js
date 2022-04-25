const express=require('express')
const router=express.Router();
const orderController=require('../controllers/order.controller');
const { isAuth, isAdmin } = require('../utils/auth');
// user
router.get('/:id',isAuth,orderController.getOrderById)
router.post('/create',isAuth,orderController.createOrder)
router.post('/delete',isAuth,orderController.deleteOrdersByUser)

// admin
router.get('/admin',isAdmin,orderController.getAllOrders)
router.put('/admin/update',isAuth,orderController.updateOrder)
router.post('/admin/delete',isAuth,orderController.deleteOrders)
module.exports=router