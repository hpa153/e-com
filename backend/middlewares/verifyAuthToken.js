const jwt = require("jsonwebtoken");

const verifyLogin = (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(403).send("No token found!");
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_KEY);
      req.user = decodedToken;
      next();
    } catch (error) {
      return res.status(401).send("Invalid token!");
    }
  } catch (error) {
    next(error);
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).send("Unauthorized! Admin authority required");
  }
};

module.exports = { verifyLogin, verifyAdmin };
