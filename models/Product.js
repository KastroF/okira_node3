const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  nom: { type: String },
  sous_cat_id: { type: String },
  prix_grossiste: { type: Number },
  prix_demi_grossiste: { type: Number },
  prix_detail: { type: Number },
  controle: { type: Boolean },
  prix_demi_grossiste_ho: { type: Number },
  prix_detail_ho: { type: Number },
  prix_demi_grossiste_mo: { type: Number },
  prix_detail_mo: { type: Number },
  prix_demi_grossiste_ng: { type: Number },
  prix_detail_ng: { type: Number },
  prix_demi_grossiste_ny: { type: Number },
  prix_detail_ny: { type: Number },
  prix_demi_grossiste_oi: { type: Number },
  prix_detail_oi: { type: Number },
  prix_demi_grossiste_ol: { type: Number },
  prix_detail_ol: { type: Number },
  prix_demi_grossiste_om: { type: Number },
  prix_detail_om: { type: Number },
  prix_demi_grossiste_wn: { type: Number },
  prix_detail_wn: { type: Number },
  image: { type: String },
});

module.exports = mongoose.model("Produit", productSchema);
