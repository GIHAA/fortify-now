const express = require("express");
const userController = require("../controllers/userController");
const protect = require("../middleware/protect");

const router = express.Router();

// Register User
router.post("/register-admin", userController.register);

// Add this to your existing router file
router.get("/users", userController.getAllUsers);

// Login User
router.post("/login", userController.login);

// Token Validation Route
router.get("/validate", userController.validateToken);

// Get User by ID
router.get("/users/:userId", protect, userController.getUser);

// Update User by ID
router.put("/users/:userId", protect, userController.updateUser);

module.exports = router;
