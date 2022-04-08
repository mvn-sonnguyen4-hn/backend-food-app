const express=require('express')
const router=express.Router();
// const {isAuth,isAdmin}=require('../until')
const foodController=require('../controllers/food.controller');
const { isAuth, isAdmin } = require('../utils/auth');
router.get('/',isAuth,foodController.getAllFood)
router.post('/create',isAdmin,foodController.createFood)


module.exports=router