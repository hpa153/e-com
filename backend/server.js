const express = require("express");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

const apiRouter = require("./routes/apiRoutes");
// const connectDB = require("./config/db");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

const PORT = 5000;
// connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", apiRouter);

// handle errors
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
});

/*
// Method 1 to connect to MongoDB
// Function to fix connection sequence
const startServer = async() => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server listening to port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

startServer();
*/

// Method 2 to connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // Start server
    app.listen(PORT, () => {
      console.log(`Server listening to port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
