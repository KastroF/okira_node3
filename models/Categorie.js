const mongoose = require("mongoose"); 

const categorieSchema = mongoose.Schema({
    
    nom: {type: String}, 
    type_id: {type: String}
})

module.exports = mongoose.model("Categorie", categorieSchema); 
