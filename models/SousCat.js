const mongoose = require("mongoose"); 

const sousCatSchema = mongoose.Schema({
    nom: {type: String}, 
    cat_id: {type: String}
})

module.exports = mongoose.model("Sous_cat", sousCatSchema); 