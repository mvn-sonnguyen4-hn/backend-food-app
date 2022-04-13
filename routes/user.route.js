const express=require('express')
const router=express.Router();
// const {isAuth,isAdmin}=require('../until')
const userController=require('../controllers/user.controller')
router.post('/register',userController.registerUser)

router.post('/login',userController.loginUser)

router.get('/auto-login',userController.autoLoginUser)

module.exports=router