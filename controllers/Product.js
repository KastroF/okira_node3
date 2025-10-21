const Type_produit = require("../models/Type");
const Categorie = require("../models/Categorie");
const Sous_cat = require("../models/SousCat");
const Produit = require("../models/Product");
const User = require("../models/User");
const NewProduct = require("../models/NewProduct");

exports.getProductsTypes = async (req, res) => {
  console.log(req.auth);

  const user = await User.findOne({ _id: req.auth.userId });
  const count1 = await Categorie.countDocuments();
  const count2 = await Produit.countDocuments();

  Type_produit.find().then(
    (types) => {
      res.status(201).json({
        types,
        count1,
        count2,
        status: 0,
        user: { name: user.name, phone: user.phone, photo: user.photo },
      });
    },
    (err) => {
      console.log(err);
      res.status(505).json({ err });
    }
  );
};

exports.getCategories = (req, res) => {
  Categorie.aggregate([
    {
      $match: {
        type_id: req.body._id,
      },
    },
    {
      $skip: req.body.startAt ? req.body.startAt : 0,
    },
    {
      $limit: 10,
    },
    {
      $group: {
        _id: null,
        categories: { $push: "$$ROOT" },
        // Récupérer la somme calculée précédemment
      },
    },

    {
      $project: {
        _id: 0,
        categories: "$categories",
      },
    },
  ]).then(
    (categories) => {
      // console.log(categories);

      res.status(201).json({
        status: 0,
        categories: categories.length > 0 ? categories[0].categories : [],
        startAt:
          categories.length > 0
            ? categories[0].categories === 10
              ? req.body.startAt
                ? req.body.startAt + 10
                : 10
              : null
            : null,
      });
    },
    (err) => {
      console.log(err);
      res.status(505).json({ err });
    }
  );
};

exports.getSousCats = (req, res) => {
  Sous_cat.aggregate([
    {
      $match: {
        cat_id: req.body._id,
      },
    },
    {
      $skip: req.body.startAt ? req.body.startAt : 0,
    },
    {
      $limit: 10,
    },
    {
      $group: {
        _id: null,
        sous_cats: { $push: "$$ROOT" },
        // Récupérer la somme calculée précédemment
      },
    },
    {
      $project: {
        _id: 0,
        categories: "$sous_cats",
      },
    },
  ]).then(
    (categories) => {
      console.log(categories);

      res.status(201).json({
        status: 0,
        categories: categories.length > 0 ? categories[0].categories : [],
        startAt:
          categories.length > 0
            ? categories[0].categories === 10
              ? req.body.startAt
                ? req.body.startAt + 10
                : 10
              : null
            : null,
      });
    },
    (err) => {
      console.log(err);
      res.status(505).json({ err });
    }
  );
};

exports.getProducts = (req, res) => {
  Produit.find({ sous_cat_id: req.body._id }).then(
    (products) => {
      res.status(201).json({ products, status: 0 });
    },
    (err) => {
      console.log(err);
      res.status(505).json({ err });
    }
  );
};

exports.getAllProducts = (req, res) => {
  Produit.find().then(
    (products) => {
      res.status(201).json({ products, status: 0 });
    },
    (err) => {
      console.log(err);
      res.status(505).json({ err });
    }
  );
};

exports.getProductsBySearch = (req, res) => {
  Produit.aggregate([
    {
      $lookup: {
        from: "sous_cats", // Nom de l'autre collection
        let: { sous_cat_id: { $toObjectId: "$sous_cat_id" } }, // Conversion de sous_cat_id en ObjectId
        pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$sous_cat_id"] } } }],
        as: "sous_cat", // Nom du champ pour stocker l'objet de la sous-catégorie
      },
    },
    {
      $project: {
        _id: 1,
        nom: 1,
        sous_cat: { $arrayElemAt: ["$sous_cat", 0] }, // Récupérer le premier élément du tableau résultant du $lookup
      },
    },
  ]).then(
    (products) => {
      res.status(201).json({ status: 0, products });
    },
    (err) => {
      res.status(505).json({ err });
    }
  );
};

exports.getSousCats2 = (req, res) => {
  Sous_cat.find().then(
    (data) => {
      res.status(201).json({ status: 0, sous_cats: data });
    },
    (err) => {
      res.status(505).json({ err });
    }
  );
};

exports.getProductById = (req, res) => {
  Produit.findOne({ _id: req.body._id }).then(
    (data) => {
      res.status(200).json({ data, status: 0 });
    },
    (err) => {
      res.status(505).json({ err });
    }
  );
};

exports.addProduct = (req, res) => {
  let product;

  console.log(req.body);

  if (req.file) {
    //Tu ne peux pas parser sous_cat_id, ce n'est pas un entier
    product = new Produit({
      nom: req.body.nom,
      sous_cat_id: req.body.sous_cat_id,
      prix_grossiste: req.body.prix_grossiste
        ? parseInt(req.body.prix_grossiste)
        : null,
      prix_demi_grossiste: req.body.prix_demi_grossiste
        ? parseInt(req.body.prix_demi_grossiste)
        : null,
      prix_detail: req.body.prix_detail ? parseInt(req.body.prix_detail) : null,
      prix_demi_grossiste_ho: req.body.prix_demi_grossiste_ho
        ? parseInt(req.body.prix_demi_grossiste_ho)
        : null,
      prix_detail_ho: req.body.prix_detail_ho
        ? parseInt(req.body.prix_detail_ho)
        : null,
      prix_demi_grossiste_mo: req.body.prix_demi_grossiste_mo
        ? parseInt(req.body.prix_demi_grossiste_mo)
        : null,
      prix_detail_mo: req.body.prix_detail_mo
        ? parseInt(req.body.prix_detail_mo)
        : null,
      prix_demi_grossiste_ng: req.body.prix_demi_grossiste_ng
        ? parseInt(req.body.prix_demi_grossiste_ng)
        : null,
      prix_detail_ng: req.body.prix_detail_ng
        ? parseInt(req.body.prix_detail_ng)
        : null,
      prix_demi_grossiste_ny: req.body.prix_demi_grossiste_ny
        ? parseInt(req.body.prix_demi_grossiste_ny)
        : null,
      prix_detail_ny: req.body.prix_detail_ny
        ? parseInt(req.body.prix_detail_ny)
        : null,
      prix_demi_grossiste_oi: req.body.prix_demi_grossiste_oi
        ? parseInt(req.body.prix_demi_grossiste_oi)
        : null,
      prix_detail_oi: req.body.prix_detail_oi
        ? parseInt(req.body.prix_detail_oi)
        : null,
      prix_demi_grossiste_ol: req.body.prix_demi_grossiste_ol
        ? parseInt(req.body.prix_demi_grossiste_ol)
        : null,
      prix_detail_ol: req.body.prix_detail_ol
        ? parseInt(req.body.prix_detail_ol)
        : null,
      prix_demi_grossiste_om: req.body.prix_demi_grossiste_om
        ? parseInt(req.body.prix_demi_grossiste_om)
        : null,
      prix_detail_om: req.body.prix_detail_om
        ? parseInt(req.body.prix_detail_om)
        : null,
      prix_demi_grossiste_wn: req.body.prix_demi_grossiste_wn
        ? parseInt(req.body.prix_demi_grossiste_wn)
        : null,
      prix_detail_wn: req.body.prix_detail_wn
        ? parseInt(req.body.prix_detail_wn)
        : null,
      image: `${req.protocol}s://${req.get("host")}/images/${
        req.file.filename
      }`,
    });
  } else {
    product = new Produit({
      nom: req.body.nom,
      sous_cat_id: req.body.sous_cat_id,
      prix_grossiste: req.body.prix_grossiste
        ? parseInt(req.body.prix_grossiste)
        : null,
      prix_demi_grossiste: req.body.prix_demi_grossiste
        ? parseInt(req.body.prix_demi_grossiste)
        : null,
      prix_detail: req.body.prix_detail ? parseInt(req.body.prix_detail) : null,
      prix_demi_grossiste_ho: req.body.prix_demi_grossiste_ho
        ? parseInt(req.body.prix_demi_grossiste_ho)
        : null,
      prix_detail_ho: req.body.prix_detail_ho
        ? parseInt(req.body.prix_detail_ho)
        : null,
      prix_demi_grossiste_mo: req.body.prix_demi_grossiste_mo
        ? parseInt(req.body.prix_demi_grossiste_mo)
        : null,
      prix_detail_mo: req.body.prix_detail_mo
        ? parseInt(req.body.prix_detail_mo)
        : null,
      prix_demi_grossiste_ng: req.body.prix_demi_grossiste_ng
        ? parseInt(req.body.prix_demi_grossiste_ng)
        : null,
      prix_detail_ng: req.body.prix_detail_ng
        ? parseInt(req.body.prix_detail_ng)
        : null,
      prix_demi_grossiste_ny: req.body.prix_demi_grossiste_ny
        ? parseInt(req.body.prix_demi_grossiste_ny)
        : null,
      prix_detail_ny: req.body.prix_detail_ny
        ? parseInt(req.body.prix_detail_ny)
        : null,
      prix_demi_grossiste_oi: req.body.prix_demi_grossiste_oi
        ? parseInt(req.body.prix_demi_grossiste_oi)
        : null,
      prix_detail_oi: req.body.prix_detail_oi
        ? parseInt(req.body.prix_detail_oi)
        : null,
      prix_demi_grossiste_ol: req.body.prix_demi_grossiste_ol
        ? parseInt(req.body.prix_demi_grossiste_ol)
        : null,
      prix_detail_ol: req.body.prix_detail_ol
        ? parseInt(req.body.prix_detail_ol)
        : null,
      prix_demi_grossiste_om: req.body.prix_demi_grossiste_om
        ? parseInt(req.body.prix_demi_grossiste_om)
        : null,
      prix_detail_om: req.body.prix_detail_om
        ? parseInt(req.body.prix_detail_om)
        : null,
      prix_demi_grossiste_wn: req.body.prix_demi_grossiste_wn
        ? parseInt(req.body.prix_demi_grossiste_wn)
        : null,
      prix_detail_wn: req.body.prix_detail_wn
        ? parseInt(req.body.prix_detail_wn)
        : null,
    });
  }

  product.save().then(
    () => {
      res
        .status(201)
        .json({ status: 0, message: "Enregistrement effectué avec succès" });
    },
    (err) => {
      console.log(err);
      res.status(505).json({ err });
    }
  );
};


exports.updateProduct = (req, res) => {
  
  let productObject;

  console.log(req.file);

  if (req.file) {
    //Tu ne peux pas parser sous_cat_id, ce n'est pas un entier
    productObject = {...req.body, image: `${req.protocol}s://${req.get("host")}/images/${req.file.filename}`}
    productObject.sous_cat_id = productObject.sous_cat_id[0]
    
  } else {
   
    productObject = req.body; 
    productObject.sous_cat_id = productObject.sous_cat_id[0]
  }

  //Produit

     
                Produit.updateOne({ _id: req.body._id}, {$set: { ...productObject}})
                .then(() => {
                  
                  console.log("C'est bon");
                  res.status(201).json({message : 'Le produit a été modifié avec succès !', status: 0}) 
                  
                  
                })
                .catch(error => {
                  
                  console.log(error)
                  res.status(401).json({ error }) 
                
                }

                    );
      
  
  
};

exports.newProposition = (req, res) => {
  
    const newProduct = new NewProduct({
        
          name: req.body.name, 
          user_id: req.auth.userId, 
          date: new Date()
        
      })
    
    newProduct.save().then(() => {
      
        res.status(201).json({message: "Proposition enregistrée avec succès", status: 0})
    
    },
    (err) => {
      
      console.log(err);
      res.status(505).json({ err })
      
    })
}