const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const Product = require("../models/ProductModel");
const prodsPerPage = require("../config/pagination");
const validateImages = require("../utils/validateImages");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const getProducts = async (req, res, next) => {
  // Pagination
  const pageNum = req.query.pageNum || 1;
  let queryCondition = false;

  // Sort products
  let sort = {};
  const sortOption = req.query.sort || "";

  if (sortOption) {
    const sortOpt = sortOption.split("_");
    sort = { [sortOpt[0]]: Number(sortOpt[1]) };
  }

  // Filter products
  let query = {};

  // By price
  let priceQueryCondition = {};
  if (req.query.price) {
    priceQueryCondition = { price: { $lte: Number(req.query.price) } };
    queryCondition = true;
  }

  // By rating
  let ratingQueryCondition = {};

  if (req.query.rating) {
    ratingQueryCondition = { rating: { $in: req.query.rating.split(",") } };
    queryCondition = true;
  }

  // By category
  // On search bar
  let categoryQueryCondition = {};
  const categoryName = req.params.categoryName || "";

  if (categoryName) {
    let a = categoryName.replaceAll(",", "/");
    let regEx = new RegExp("^" + a);
    categoryQueryCondition = { category: regEx };
    queryCondition = true;
  }

  // On sidebar
  const categories = req.query.category || "";

  if (categories) {
    let a = categories.split(",").map((item) => {
      if (item) {
        return new RegExp("^" + item);
      }
    });

    categoryQueryCondition = { category: { $in: a } };
    queryCondition = true;
  }

  // By attributes
  let attrQueryCondition = [];
  let hasAttrQuery = false;

  if (req.query.attrs) {
    attrQueryCondition = req.query.attrs.split(",").reduce((acc, item) => {
      if (item) {
        const arrItem = item.split("-");
        const searchAttr = {
          attrs: {
            $elemMatch: { key: arrItem[0], value: { $in: arrItem.slice(1) } },
          },
        };

        acc.push(searchAttr);

        return acc;
      } else {
        return acc;
      }
    }, []);
    queryCondition = true;
  }

  // From search bar input
  const searchQuery = req.params.searchQuery || "";
  let searchQueryCondition = {};
  let selectedAttr = {};

  if (searchQuery) {
    queryCondition = true;
    searchQueryCondition = { $text: { $search: '"' + searchQuery + '"' } };

    // Sort products by text match
    select = {
      score: { $meta: "textScore" },
    };
    sort = {
      score: { $meta: "textScore" },
    };
  }

  // Create query for search
  if (queryCondition) {
    query = {
      $and: [
        priceQueryCondition,
        ratingQueryCondition,
        categoryQueryCondition,
        searchQueryCondition,
        ...attrQueryCondition,
      ],
    };
  }

  const totalProds = await Product.countDocuments(query);

  try {
    const products = await Product.find(query)
      .select(selectedAttr)
      .skip(prodsPerPage * (pageNum - 1))
      .sort(sort)
      .limit(prodsPerPage);

    res.json({
      products,
      pageNum,
      totalPages: Math.ceil(totalProds / prodsPerPage),
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("reviews")
      .orFail();

    res.json(product);
  } catch (error) {
    next(error);
  }
};

const getBestSellers = async (req, res, next) => {
  try {
    const bestSellers = await Product.aggregate([
      { $sort: { category: 1, sales: -1 } },
      {
        $group: { _id: "$category", doc_with_max_sales: { $first: "$$ROOT" } },
      },
      { $replaceWith: "$doc_with_max_sales" },
      { $match: { sales: { $gt: 0 } } },
      { $project: { _id: 1, name: 1, images: 1, category: 1, description: 1 } },
      { $limit: 3 },
    ]);

    res.json(bestSellers);
  } catch (error) {
    next(error);
  }
};

const getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.find({})
      .sort({ category: 1 })
      .select("name price category");

    res.json(products);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).orFail();
    await product.deleteOne();

    res.json({ message: "Product was deleted!" });
  } catch (error) {
    next(error);
  }
};

const createAdminProduct = async (req, res, next) => {
  try {
    const newProduct = new Product();
    const { name, description, count, price, category, attributesTable } =
      req.body;

    newProduct.name = name;
    newProduct.description = description;
    newProduct.count = count;
    newProduct.price = price;
    newProduct.category = category;

    if (attributesTable.length > 0) {
      attributesTable.map((item) => {
        newProduct.attrs.push(item);
      });
    }

    await newProduct.save();

    res.json({ message: "Product was created!", productId: newProduct._id });
  } catch (error) {
    next(error);
  }
};

const updateAdminProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).orFail();
    const { name, description, count, price, category, attributesTable } =
      req.body;

    product.name = name || product.name;
    product.description = description || product.description;
    product.count = count || product.count;
    product.price = price || product.price;
    product.category = category || product.category;
    product.attrs = attributesTable;

    await product.save();

    res.json({ message: "Product was updated!" });
  } catch (error) {
    next(error);
  }
};

const uploadFile = async (req, res, next) => {
  try {
    /* Upload images to server */
    // let uploadedImages = req.files.images;

    // if (!req.files || !!uploadedImages === false) {
    //   return res.status(400).send("No files found!");
    // }

    // const validationResult = validateImages(uploadedImages);

    // if (validationResult.error) {
    //   return res.status(400).send(validationResult.error);
    // }

    // const product = await Product.findById(req.query.productId).orFail();

    // const uploadDir = path.resolve(
    //   __dirname,
    //   "../../frontend",
    //   "public",
    //   "images",
    //   "products"
    // );

    // if (!Array.isArray(uploadedImages)) {
    //   uploadedImages = [uploadedImages];
    // }

    // for (let image of uploadedImages) {
    //   const fileName = uuidv4() + path.extname(image.name);
    //   const uploadPath = uploadDir + "/" + fileName;

    //   product.images.push({ path: "/images/products/" + fileName });

    //   image.mv(uploadPath, function (err) {
    //     if (err) {
    //       return res.status(500).send(err);
    //     }
    //   });
    // }

    // await product.save();

    // res.send("Images were uploaded!");

    /* Save cloudinary image paths to server */
    const product = await Product.findById(req.query.productId).orFail();
    product.images.push({ path: req.body.url });
    await product.save();
  } catch (error) {
    next(error);
  }
};

const deleteFile = async (req, res, next) => {
  try {
    const imagePath = decodeURIComponent(req.params.imagePath);
    /* Delete image from server */
    // const finalPath = path.resolve("../frontend/public") + imagePath;

    // fs.unlink(finalPath, (err) => {
    //   if (err) {
    //     res.status(500).send(err);
    //   }
    // });

    /* Delete image from cloudinary */
    // cloudinary.uploader.destroy(imagePath);
    await Product.findOneAndUpdate(
      { _id: req.params.productId },
      { $pull: { images: { path: imagePath } } }
    ).orFail();

    res.send("Image was deleted!");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getBestSellers,
  getAdminProducts,
  deleteProduct,
  createAdminProduct,
  updateAdminProduct,
  uploadFile,
  deleteFile,
};
