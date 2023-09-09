const express = require("express");

const productRoutes = require("./productRoutes");
const categoryRoutes = require("./categoryRoutes");
const userRoutes = require("./userRoutes.js");
const orderRoutes = require("./orderRoutes");

const app = express();
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);

module.exports = app;
