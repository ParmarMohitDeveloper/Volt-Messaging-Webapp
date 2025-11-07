require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");
const path = require("path");
const fs = require("fs");

const app = express();

// ✅ Middleware setup
app.use(
  cors({
    origin: "https://voltmessage.netlify.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(bodyParser.json());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MongoDB Configs
require("./MongoDb/config");
require("./MongoDb/otpSaveMongo/otpSaveMongo");
require("./MongoDb/signupMongo/signupMongo");
require("./MongoDb/chatMongo/chatMongo");
require("./MongoDb/messageMongo/messageMongo");

// ✅ Import Routes
const signup = require("./Routes/signUpRoutes/signUpRoutes");
const verify_signup = require("./Routes/verifySignUpRoutes/verifySignUpRoutes");
const login = require("./Routes/loginRoutes/loginRoutes");
const user = require("./Routes/userRoutes/userRoutes");
const message = require("./Routes/messageRoutes/messageRoutes");
const chat = require("./Routes/chatRoutes/chatRoutes");

// ✅ Use Routes
app.use("/", signup);
app.use("/", verify_signup);
app.use("/", login);
app.use("/", user);
app.use("/", message);
app.use("/", chat);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🚀 Jai Shree Ram — Backend is running!");
});

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Initialize Socket.io
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://voltmessage.netlify.app", // React frontend
    credentials: true,
  },
});

// ✅ Import socket logic
const chatSocket = require("./sockets/chatSocket");

// ✅ Handle socket connections
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);
  chatSocket(io, socket);
});

// ✅ Start server (use server.listen instead of app.listen)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server is listening on port ${PORT}`);
});
