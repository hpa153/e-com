const express = require("express");

const {
  getUsers,
  getUser,
  registerUser,
  loginUser,
  updateUser,
} = require("../controllers/userController");
const { verifyLogin, verifyAdmin } = require("../middlewares/verifyAuthToken");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.use(verifyLogin);
router.get("/profile/:id", getUser);
router.put("/profile", updateUser);

router.use(verifyAdmin);
router.get("/", getUsers);

module.exports = router;
