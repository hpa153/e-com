const ObjectId = require("mongodb").ObjectId;

const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");

const getUserOrders = async (req, res, next) => {
  try {
    const userOrders = await Order.find({ user: new ObjectId(req.user._id) });

    res.json(userOrders);
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "-password -isAdmin -_id -__v -createdAt -updatedAt")
      .orFail();

    res.json(order);
  } catch (error) {
    next(error);
  }
};

const makeOrder = async (req, res, next) => {
  try {
    const { cartItems, orderTotal, paymentMethod } = req.body;

    if (!cartItems || !orderTotal || !paymentMethod) {
      return res.status(400).send("All inputs are required!");
    }

    const prodIds = cartItems.map((prod) => prod.productId);
    const prodQty = cartItems.map((prod) => Number(prod.quantity));

    await Product.find({ _id: { $in: prodIds } }).then((products) => {
      products.forEach((prod, idx) => {
        prod.sales += prodQty[idx];
        prod.save();
      });
    });

    const order = new Order({
      user: new ObjectId(req.user._id),
      orderTotal,
      cartItems,
      paymentMethod,
    });

    const newOrder = await order.save();

    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
};

const payOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).orFail();
    order.isPaid = true;
    order.paidAt = Date.now();
    await order.save();

    res.json(order);
  } catch (error) {
    next(error);
  }
};

const deliverOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).orFail();
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    await order.save();

    res.json(order);
  } catch (error) {
    next(error);
  }
};

const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate("user", "-password")
      .sort({ paymentmethod: "desc" });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getAnalysisOrders = async (req, res, next) => {
  try {
    const startTime = new Date(req.params.date);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(req.params.date);
    endTime.setHours(23, 59, 59, 999);
    const orders = await Order.find({
      createdAt: { $gte: startTime, $lte: endTime },
    }).sort({ createdAt: "desc" });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserOrders,
  getOrder,
  makeOrder,
  payOrder,
  deliverOrder,
  getAdminOrders,
  getAnalysisOrders,
};
