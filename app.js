const express = require("express");
const mongoose = require("mongoose");

const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );

  next();
});

mongoose
  .connect(
    "mongodb+srv://chronicklmali:jVByDuAGkS3Ybsdn@cluster0.f1nhqgj.mongodb.net/okira?retryWrites=true&w=majority",

    { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const userRouter = require("./routes/User");
const productRouter = require("./routes/Product");
const alertRouter = require("./routes/Alert");

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/alert", alertRouter);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
