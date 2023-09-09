const express = require("express");

const {
  getCategories,
  addCategory,
  deleteCategory,
  addAttr,
} = require("../controllers/categoryController");

const router = express.Router();

router.get("/", getCategories);
router.post("/", addCategory);
router.post("/add-attr", addAttr);
router.delete("/:category", deleteCategory);

module.exports = router;
