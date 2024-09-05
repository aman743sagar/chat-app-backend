let express=require('express')
const {register, login, logout,getotherouser}=require('../CONTROLER/userController');
const { isAuthenticate } = require('../MIDDELWARE/authentication');
const router =express.Router();
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/").get(isAuthenticate,getotherouser);



module.exports=router