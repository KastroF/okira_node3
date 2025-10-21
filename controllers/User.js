const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



function genererCode() {
  // Générer un nombre aléatoire entre 100000 et 999999
  const code = Math.floor(Math.random() * 9000) + 1000;
  return code.toString(); // Convertir le nombre en chaîne de caractères
}

function formatNumeroTelephone(numero) {
  // Supprimer les espaces et les caractères non numériques
  numero = numero.replace(/\D/g, "");

  // Vérifier si le numéro commence par le préfixe régional
  if (numero.startsWith("0")) {
    // Supprimer le zéro initial
    numero = numero.slice(1);
  }

  // Ajouter le préfixe du pays Gabon (+241)
  numero = "+241" + numero;

  return numero;
}

exports.signUp = (req, res) => {
  const code = genererCode();

  User.findOne({ phone: req.body.phone, hasBeenDeleted: false }).then(
    (user) => {
      if (user) {
        res
          .status(201)
          .json({ status: 1, message: "Numéro de téléphone déjà utilisé" });
      } else {
        bcrypt.hash(req.body.password, 10).then(
          async (hash) => {
            const newUser = User({
              phone: req.body.phone,
              name: req.body.name,
              password: hash,
              date: new Date(),
              hasBeenDeleted: false, 
              active: true
            });

            const us = await newUser.save().then((uss) => {
              return uss._id;
            });

            res.status(201).json({
              status: 0,
              message: "Utilisateur ajouté avec succès",
              token: jwt.sign(
                { userId: us._id },
                "JxqKuulLNPCNfytiyqtsygygfRJYTjgkbhilaebAqetflqRfhhouhpb"
              ),
            });
          },
          (err) => {
            res.status(505).json({ err });
          }
        );
      }
    },
    (err) => {
      res.status(505).json({ err });
    }
  );
};

exports.sendCode = () => {

  
}

exports.signIn = (req, res) => {
  
  console.log(req.body);
  
  User.findOne({
    phone: req.body.phone,
    hasBeenDeleted: false
  }).then(
    (user) => {
      if (!user) {
        res.status(201).json({ status: 1, message: "Numéro introuvable" });
      } else {
        bcrypt.compare(req.body.password, user.password).then((valid) => {
          if (valid) {
            
            if (user.active) {
              
              res.status(201).json({
                status: 0,
                message: "Connecté avec succès",
                token: jwt.sign(
                  { userId: user._id },
                  "JxqKuulLNPCNfytiyqtsygygfRJYTjgkbhilaebAqetflqRfhhouhpb"
                ),
                stat: user.status,
                nom: user.name,
                admin:user.admin,
                
              });
            
            } else {
              console.log("Compte pas encore activé")
              res.status(201).json({
                status: 1,
                message: "Compte pas encore activé",
                token: jwt.sign(
                  { userId: user._id },
                  "JxqKuulLNPCNfytiyqtsygygfRJYTjgkbhilaebAqetflqRfhhouhpb"
                ),
               
              });
            }
          } else {
            console.log("Mot de passe incorrect")
            res
              .status(201)
              .json({ status: 1, message: "Mot de passe incorrect" });
          }
        });
      }
    },
    (err) => {
      console.log(err)
      res.status(402).json({ err });
    }
  );
};

exports.checkUser = (req, res) => {
  User.findOne({ _id: req.auth.userId }).then(
    (user) => {
      if (user && user.active == true) {
        res.status(201).json({ status: 0 });
      } else {
        res.status(201).json({ status: 1 });
      }
    },
    (err) => {
      res.status(402).json({ err });
    }
  );
};

/*exports.sendCode = async (req, res) => {
  
  const code = genererCode();
  const field = "phone";

  console.log("On envoie le code");
  console.log("je ne vois rien");

  const user = await User.findOne({ _id: req.auth.userId });
  
  


  client.messages
    .create({
      body: `Votre code de verification Okira est le ${code}`,
      from: "OKIRA",
      to: formatNumeroTelephone(user.phone),
    })
    .then(
      (message) => {
 
          User.updateOne({ _id: req.auth.userId }, { $set: { code } }).then(
          () => {
            //console.log("c'est bon?", message);

            res.status(201).json({ status: 0 });
          },
          (err) => {
            console.log(err);
            console.log("c'est pas bon?");
            res.status(505).json({ err });
          }
        );
        
      },
      (err) => {
        console.log(err);
        res.status(505).json({ err });
      }
    ); 
}; */

exports.verifyCode = (req, res) => {
  User.findOne({
    _id: req.auth.userId,
  }).then(
    (user) => {
      
      if (user.code == req.body.code) {
        
        User.updateOne({ _id: user._id }, { $set: { active: true } }).then(
          () => {
            console.log("action effectuée avec succès");
            res.status(201).json({ status: 0, message: "c'est Ok!" });
          },
          (err) => {
            console.log(err);
            res.status(505).json({ err });
          }
        );
      } else {
        res.status(201).json({
          status: 1,
          message: "Le code que vous avez renseigné est erroné",
        });
      }
    },
    (err) => {
      console.log(err);
      res.status(505).json({ err });
    }
  );
};


exports.addPhoto = (req, res) => {
  
  console.log(req.body);
  
    User.updateOne({_id: req.auth.userId}, {$set: {photo: `${req.protocol}s://${req.get("host")}/images/${
        req.file.filename
      }`}}).then(() => {
      
      
      User.findOne({_id: req.auth.userId}).then((user) => {
        
          res.status(201).json({status: 0, message: "Modification effectuée avec succès", 
                               user: { name: user.name, phone: user.phone, photo: user.photo }});
      })
        
    },
    (err) => {
      console.log(err);
      res.status(505).json({ err });
    }
  )
}

exports.onDelete = (req, res) => {
  
    User.updateOne({_id: req.auth.userId}, {$set: {hasBeenDeleted: true, deletedDate: new Date()}}).then(() => {
      
      res.status(201).json({message: "Update effectué avec succès", status: 0})
        
    }, (err) => {
      
        res.status(505).json({err})
    })
}