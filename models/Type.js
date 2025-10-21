const mongoose = require("mongoose"); 

const TypeSchema = mongoose.Schema({
    nom: {type: String}
})

module.exports = mongoose.model("Type_produit",  TypeSchema); 
