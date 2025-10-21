const express = require("express"); 

const router = express.Router(); 

const productCtrl = require("../controllers/Product"); 

const auth = require("../middleware/auth");

const multer = require("../middleware/multer-configs");



router.get("/gettypes", auth, productCtrl.getProductsTypes);
router.post("/getcategories", auth, productCtrl.getCategories); 
router.post("/getsouscats", auth, productCtrl.getSousCats)
router.post("/getproducts", auth, productCtrl.getProducts); 
router.get("/getallproducts", auth, productCtrl.getAllProducts); 
router.get("/getproductsforsearch", auth, productCtrl.getProductsBySearch);
router.get("/getsouscats2", auth, productCtrl.getSousCats2);
router.post("/getproductbyid", auth, productCtrl.getProductById); 
router.post("/addproduct", auth, multer, productCtrl.addProduct);
router.post("/newproduct", auth, productCtrl.newProposition);
//script de modification du produit
router.put("/updateproduct", auth, multer,  productCtrl.updateProduct);




module.exports = router; 
