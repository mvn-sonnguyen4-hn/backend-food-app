const express=require('express')
const router=express.Router();
const {isAuth}=require('../utils/auth')
const userController=require('../controllers/user.controller')
router.post('/register',userController.registerUser)

router.post('/login',userController.loginUser)
router.post('/update',isAuth,userController.updateUser)

router.get('/auto-login',userController.autoLoginUser)

module.exports=router