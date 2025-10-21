const Alert = require("../models/Alert");

exports.getAlertsByUser = (req, res) => {
  Alert.find({ user_id: req.auth.userId })
    .sort({ date: -1 })
    .skip(req.body.startAt)
    .limit(10)
    .then(
      (alerts) => {
        res
          .status(201)
          .json({
            status: 0,
            alerts,
            startAt:
              alerts.length == 10 ? parseInt(req.body.startAt) + 10 : null,
          });
      },
      (err) => {
        res.status(505).json({ err });
      }
    );
};

exports.addAlert = (req, res) => {
   //console.log(req.body);
  //console.log(`${req.protocol}s://${req.get("host")}/images/${req.file.filename}`);

  let alert;
  
  console.log(req.body); 
  //console.log(req.file);

  if (req.file) {
    alert = new Alert({
      name: req.body.name,
      date: new Date(),
      shopName: req.body.shopName,
      photo: `${req.protocol}s://${req.get("host")}/images/${
        req.file.filename
      }`,
      street: req.body.street,
      description: req.body.description,
      lat: req.body.lat ? req.body.lat :  null,
      long: req.body.long ? req.body.long : null,
      user_id: req.auth.userId,
      product_id: req.body.product_id
    });
  } else {
    
    
    
    alert = new Alert({
      name: req.body.name,
      date: new Date(),
      shopName: req.body.shopName,
      description: req.body.description,
      street: req.body.street,
      lat: req.body.lat ? req.body.lat :  null,
      long: req.body.long ? req.body.long : null,
      user_id: req.auth.userId,
      product_id: req.body.product_id
    });
  }

  alert.save().then(
    () => {
      console.log("Tout s'est bien passé");
      res.status(201).json({ status: 0 });
    },
    (err) => {
      console.log(err);
      res.status(505).json({ err });
    }
  );
};
