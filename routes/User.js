const express = require("express"); 

const router = express.Router(); 

const userCtrl = require("../controllers/User"); 

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-configs");


router.post("/signup", userCtrl.signUp); 
router.post("/signin", userCtrl.signIn);
router.post("/verifycode", auth, userCtrl.verifyCode);
router.get("/checkuser", auth, userCtrl.checkUser);
router.post("/sendcode",auth, userCtrl.sendCode);
router.post("/addphoto", auth, multer, userCtrl.addPhoto);
router.get("/ondelete", auth, userCtrl.onDelete); 






module.exports = router; 
