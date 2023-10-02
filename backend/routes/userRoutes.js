const express = require("express");

const {
  getUsers,
  getUserProfile,
  getUser,
  registerUser,
  loginUser,
  updateUser,
  updateUserAdmin,
  writeReview,
  deleteUser,
} = require("../controllers/userController");
const { verifyLogin, verifyAdmin } = require("../middlewares/verifyAuthToken");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.use(verifyLogin);
router.get("/profile/:id", getUserProfile);
router.put("/profile", updateUser);
router.post("/review/:productId", writeReview);

router.use(verifyAdmin);
router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", updateUserAdmin);
router.delete("/:id", deleteUser);

module.exports = router;
