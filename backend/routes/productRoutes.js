const express = require("express");

const {
  getProducts,
  getProductById,
  getBestSellers,
  getAdminProducts,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

router.get("/categories/:categoryName/search/:searchQuery", getProducts);
router.get("/categories/:categoryName", getProducts);
router.get("/search/:searchQuery", getProducts);
router.get("/best-sellers", getBestSellers);
router.get("/product/:id", getProductById);
router.get("/", getProducts);

// Admin routes
router.get("/admin", getAdminProducts);
router.delete("/admin/:id", deleteProduct);

module.exports = router;
