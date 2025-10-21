
const express = require("express"); 

const router = express.Router(); 

const alertCtrl = require("../controllers/Alert"); 

const auth = require("../middleware/auth");

const multer = require("../middleware/multer-configs");



router.post("/getalertsbyuser", auth, alertCtrl.getAlertsByUser);
router.post("/addalert", auth, multer, alertCtrl.addAlert); 




module.exports = router; 
