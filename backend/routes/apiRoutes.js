const express = require("express");

const productRoutes = require("./productRoutes");

const app = express();
app.use("/products", productRoutes);

module.exports = app;
