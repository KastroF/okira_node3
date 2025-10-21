const mongoose = require("mongoose"); 


const AlertSchema = mongoose.Schema({
      
    shopName: {type: String}, 
    name: {type: String}, 
    lat: {type: String}, 
    long: {type: String}, 
    description: {type: String},
    photo: {type:  String},
    user_id: {type: String},
    date: {type : Date}, 
    status: {type: Boolean}, 
    street: {type: String}, 
    product_id: {type: String}, 
    
})

module.exports = mongoose.model("Alert", AlertSchema); 