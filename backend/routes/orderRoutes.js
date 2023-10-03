const express = require("express");

const {
  getUserOrders,
  getOrder,
  makeOrder,
  payOrder,
  deliverOrder,
  getAdminOrders,
  getAnalysisOrders,
} = require("../controllers/orderController");
const { verifyLogin, verifyAdmin } = require("../middlewares/verifyAuthToken");

const router = express.Router();

router.use(verifyLogin);
router.get("/", getUserOrders);
router.get("/user/:id", getOrder);
router.post("/", makeOrder);
router.put("/paid/:id", payOrder);

router.use(verifyAdmin);
router.put("/delivery/:id", deliverOrder);
router.get("/admin", getAdminOrders);
router.get("/analysis/:date", getAnalysisOrders);

module.exports = router;
