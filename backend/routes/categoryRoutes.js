const express = require("express");

const {
  getCategories,
  addCategory,
  deleteCategory,
  addAttr,
} = require("../controllers/categoryController");
const { verifyLogin, verifyAdmin } = require("../middlewares/verifyAuthToken");

const router = express.Router();

router.get("/", getCategories);

router.use(verifyLogin);
router.use(verifyAdmin);
router.post("/", addCategory);
router.post("/add-attr", addAttr);
router.delete("/:category", deleteCategory);

module.exports = router;
