let express=require('express')
const {sendMessage,getmessage}=require('../CONTROLER/messageController')
const { isAuthenticate } = require('../MIDDELWARE/authentication');
const router =express.Router();
router.route("/send/:id").post(isAuthenticate,sendMessage);
router.route("/:id").get(isAuthenticate,getmessage);



module.exports=router