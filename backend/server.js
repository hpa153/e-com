const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const apiRouter = require("./routes/apiRoutes");
// const connectDB = require("./config/db");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

const PORT = 5000;
// connectDB();
const httpServer = createServer(app);
global.io = new Server(httpServer);

const admins = [];
const activeChats = [];

io.on("connection", (socket) => {
  socket.on("admin connected", (admin) => {
    admins.push({ id: socket.id, admin });
  });

  socket.on("client message", (msg) => {
    if (admins.length === 0) {
      socket.emit("no admin", "");
    } else {
      const chatClient = activeChats.find(
        (client) => client.clientId === socket.id
      );

      let adminInCharge;

      if (chatClient) {
        adminInCharge = chatClient.adminId;
      } else {
        const admin = admins[Math.floor(Math.random() * admins.length)];
        adminInCharge = admin.id;
        activeChats.push({
          clientId: socket.id,
          adminId: adminInCharge,
        });
      }

      socket.broadcast.to(adminInCharge).emit("client message to admin", {
        user: socket.id,
        message: msg,
      });
    }
  });

  socket.on("admin message", (message) => {
    socket.broadcast.emit("admin message to client", {
      message,
    });
  });

  socket.on("admin closed chat", (socketId) => {
    socket.broadcast.to(socketId).emit("admin closed chat", "");
    const connection = io.sockets.sockets.get(socketId);
    connection.disconnect();
  });

  socket.on("disconnect", (reason) => {
    // Disconnect admin
    const adminIndexToBeRemoved = admins.findIndex(
      (admin) => admin.id === socket.id
    );

    if (adminIndexToBeRemoved !== -1) {
      admins.splice(adminIndexToBeRemoved, 1);
    }

    activeChats = activeChats.filter((chat) => chat.adminId !== socket.id);

    // Disconnect client
    const clientIndexToBeRemoved = clients.findIndex(
      (client) => client.clientId === socket.id
    );

    if (clientIndexToBeRemoved !== -1) {
      activeChats.splice(clientIndexToBeRemoved, 1);
    }

    socket.broadcast.emit("disconnected", { reason, socketId: socket.id });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", apiRouter);

// handle errors
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    res.status(500).json({
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(500).json({
      message: err.message,
    });
  }
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
    // app.listen(PORT, () => {
    httpServer.listen(PORT, () => {
      console.log(`Server listening to port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
