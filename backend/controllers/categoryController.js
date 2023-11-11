const Category = require("../models/CategoryModel");

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({}).sort({ name: "asc" }).orFail();

    res.json(categories);
  } catch (error) {
    next(error);
  }
};

const addCategory = async (req, res, next) => {
  try {
    const { category } = req.body;

    if (!category) {
      res.status(400).send("Category is required!");
    }

    const categoryExists = await Category.findOne({
      category,
    });

    if (categoryExists) {
      res.status(400).send("Category already exists!");
    } else {
      const newCategory = await Category.create({
        name: category,
      });

      res.status(201).send("Categroy created!");
    }
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  const category = req.params.category;

  try {
    if (category !== "Choose category") {
      const categoryExist = await Category.findOne({
        name: decodeURIComponent(category),
      }).orFail();

      await Category.deleteOne({ _id: categoryExist._id });
      res.json({ categoryDeleted: true });
    }

    res.json(categories);
  } catch (error) {
    next(error);
  }
};

const addAttr = async (req, res, next) => {
  const { key, value, chosenCategory } = req.body;

  if (!key || !value || !chosenCategory) {
    res.status(400).send("All inputs are required!");
  }

  try {
    const category = chosenCategory.split("/")[0];

    const categoryExists = await Category.findOne({
      name: category,
    }).orFail();

    if (categoryExists.attrs.length > 0) {
      let keyNotExists = true;

      categoryExists.attrs.map((attr, idx) => {
        if (attr.key === key) {
          keyNotExists = false;
          categoryExists.attrs[idx].value = Array.from(
            new Set([...attr.value, value])
          );
        }
      });

      if (keyNotExists) {
        categoryExists.attrs.push({ key, value });
      }

      await categoryExists.save();

      const categories = await Category.find({}).sort({ name: "asc" });
      return res.status(201).json({ categoryUpdated: categories });
    } else {
      categoryExists.attrs.push({ key, value: [value] });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, addCategory, deleteCategory, addAttr };
