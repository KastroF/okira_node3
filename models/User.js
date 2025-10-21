const mongoose = require("mongoose"); 

const UserSchema = mongoose.Schema({
    
    name: {type: String}, 
    phone: {type: String}, 
    password: {type: String}, 
    date: {type: Date}, 
    code: {type: String}, 
    active: {type: Boolean}, 
    photo: {type: String}, 
    hasBeenDeleted: {type: Boolean}, 
    deletedDate: {type: Date}
  
})

module.exports = mongoose.model("User", UserSchema); 