const express = require("express");
const router = express.Router();

const { signup, getAllUsers } = require("../../Controller/signupControl/signupControl");
const auth = require("../../middleware/auth");


// Signup route
router.post("/signup", signup);

// Protected route — get all users
router.get("/get/all/users", auth, getAllUsers);

module.exports = router;
