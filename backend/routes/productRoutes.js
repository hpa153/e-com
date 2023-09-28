const express = require("express");

const {
  getProducts,
  getProductById,
  getBestSellers,
  getAdminProducts,
  deleteProduct,
  createAdminProduct,
  updateAdminProduct,
  uploadFile,
  deleteFile,
} = require("../controllers/productController");
const { verifyLogin, verifyAdmin } = require("../middlewares/verifyAuthToken");

const router = express.Router();

router.get("/categories/:categoryName/search/:searchQuery", getProducts);
router.get("/categories/:categoryName", getProducts);
router.get("/search/:searchQuery", getProducts);
router.get("/best-sellers", getBestSellers);
router.get("/product/:id", getProductById);
router.get("/", getProducts);

// Admin routes
router.use(verifyLogin);
router.use(verifyAdmin);
router.get("/admin", getAdminProducts);
router.delete("/admin/:id", deleteProduct);
router.post("/admin/file-upload", uploadFile);
router.delete("/admin/image/:imagePath/:productId", deleteFile);
router.post("/admin", createAdminProduct);
router.put("/admin/:id", updateAdminProduct);

module.exports = router;
