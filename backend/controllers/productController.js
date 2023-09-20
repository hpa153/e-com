const Product = require("../models/ProductModel");
const prodsPerPage = require("../config/pagination");

const getProducts = async (req, res, next) => {
  // Pagination
  const pageNum = req.query.pageNum || 1;
  const totalProds = await Product.countDocuments({});

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
  const categoryName = req.params.categoryName | "";

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

module.exports = {
  getProducts,
  getProductById,
  getBestSellers,
  getAdminProducts,
  deleteProduct,
};
