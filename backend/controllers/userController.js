const User = require("../models/UserModel");
const Review = require("../models/ReviewModel");
const Product = require("../models/ProductModel");
const { hashPassword, comparePasswords } = require("../utils/hashPassword");
const generateAuthToken = require("../utils/generateAuthToken");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password").orFail();

    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).orFail();

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).send("All inputs are required!");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ error: "This email address has already been used!" });
    } else {
      const hashedPassword = hashPassword(password);
      const newUser = await User.create({
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
      });

      res
        .cookie(
          "access_token",
          generateAuthToken(
            newUser._id,
            newUser.firstName,
            newUser.lastName,
            newUser.lastName,
            newUser.isAdmin
          ),
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === "userion",
            sameSite: "strict",
          }
        )
        .status(201)
        .json({
          success: "User registered!",
          userCreated: {
            _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.lastName,
            isAdmin: newUser.isAdmin,
          },
        });
    }
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password, doNotLogout } = req.body;

    if (!email || !password) {
      return res.status(400).send("All inputs are required!");
    }

    const user = await User.findOne({ email }).orFail();

    if (user && comparePasswords(password, user.password)) {
      let cookieParams = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "userion",
        sameSite: "strict",
      };

      if (doNotLogout) {
        cookieParams = { ...cookieParams, maxAge: 1000 * 60 * 60 * 24 * 7 };
      }

      res
        .cookie(
          "access_token",
          generateAuthToken(
            user._id,
            user.firstName,
            user.lastName,
            user.lastName,
            user.isAdmin
          ),
          cookieParams
        )
        .json({
          success: "User logged in!",
          userLoggedIn: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.lastName,
            isAdmin: user.isAdmin,
            doNotLogout,
          },
        });
    } else {
      return res.status(401).send("Incorrect credentials!");
    }
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail();
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = user.email;
    user.phoneNumber = req.body.phoneNumber;
    user.address = req.body.address;
    user.country = req.body.country;
    user.zipCode = req.body.zipCode;
    user.city = req.body.city;
    user.state = req.body.state;

    if (req.body.password !== user.password) {
      user.password = hashPassword(req.body.password);
    }

    await user.save();

    res.json({
      success: "User profile was updated",
      userUpdated: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    next(error);
  }
};

const writeReview = async (req, res, next) => {
  try {
    const { comment, rating } = req.body;

    if (!(comment && rating)) {
      return res.status(400).send("All inputs are required!");
    }

    const product = await Product.findById(req.params.productId).populate(
      "reviews"
    );

    // Check if user already reviewed product
    const alreadyReviewed = product.reviews.find(
      (review) => review.user._id.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).send("You already reviewed this product!");
    }

    // Create review
    const ObjectId = require("mongodb").ObjectId;
    const reviewId = new ObjectId();

    await Review.create([
      {
        _id: reviewId,
        comment,
        rating,
        user: {
          _id: req.user._id,
          name: req.user.firstName + " " + req.user.lastName,
        },
      },
    ]);

    // Add review and calculate rating
    const tempRating = [...product.reviews, { rating }];
    product.reviews.push(reviewId);

    if (product.reviews.length === 1) {
      product.rating = Number(rating);
      product.reviewsNumber = 1;
    } else {
      product.reviewsNumber = product.reviews.length;
      product.rating = Math.round(
        tempRating
          .map((review) => review.rating)
          .reduce((sum, rating) => sum + rating, 0) / product.reviews.length
      );
    }

    await product.save();

    res.json(product);
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select("firstName lastName email isAdmin")
      .orFail();

    res.json(user);
  } catch (error) {
    next(error);
  }
};

const updateUserAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).orFail();
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin;

    await user.save();

    res.send("Successfully updated user!");
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).orFail();
    await user.deleteOne();

    res.send("Deleted user!");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserProfile,
  registerUser,
  loginUser,
  updateUser,
  writeReview,
  getUser,
  updateUserAdmin,
  deleteUser,
};
