const express=require('express')
const router=express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');

// const {isAuth,isAdmin}=require('../until')
const foodController=require('../controllers/food.controller');
const { isAuth, isAdmin } = require('../utils/auth');
router.get('/',foodController.getFoodByPaginationAndCategory)
router.post('/create',upload,foodController.createFood)


module.exports=router