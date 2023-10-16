const express = require("express");

const productRoutes = require("./productRoutes");
const categoryRoutes = require("./categoryRoutes");
const userRoutes = require("./userRoutes.js");
const orderRoutes = require("./orderRoutes");

const app = express();
const jwt = require("jsonwebtoken");

app.get("/get-token", (req, res) => {
  try {
    const accessToken = req.cookies["access_token"];
    const decodedToken = jwt.verify(accessToken, process.env.JWT_KEY);

    return res.json({
      isAdmin: decodedToken.isAdmin,
    });
  } catch (error) {
    return res.status(401).send("Unauthorized! Invalid token!");
  }
});
app.get("/logout", (req, res) => {
  return res.clearCookie("access_token").send("Logged out!");
});
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);

module.exports = app;
