const mongoose = require("mongoose"); 

const newProductSchema = mongoose.Schema({
    
      name: {type: String}, 
      date: {type: Date}, 
      user_id: {type: String}
})

module.exports = mongoose.model("Newproduct", newProductSchema)