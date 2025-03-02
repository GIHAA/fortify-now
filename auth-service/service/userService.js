// service/userService.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepo = require("../repository/userRepo");

require("dotenv").config();

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET || "defaultsecret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
};

// Register user
const registerUser = async (username, email, password) => {
  try {
    const existingUser = await userRepo.findUserByEmail(email);
    if (existingUser) {
      return { success: false, statusCode: 400, message: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userRepo.createUser(username, email, hashedPassword , "ADMIN");

    return {
      success: true,
      data: { id: newUser.id, username, email },
      message: "User created successfully",
    };
  } catch (error) {
    console.error("Error in registration service:", error);
    return { success: false, statusCode: 500, message: "Server error" };
  }
};

// Login user
const loginUser = async (email, password) => {
  try {
    const user = await userRepo.findUserByEmail(email);
    if (!user) {
      return { success: false, statusCode: 404, message: "User not found" };
    }
  
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return { success: false, statusCode: 400, message: "Invalid password" };
    }

    const token = generateToken({ id: user.id, email: user.email , username: user.username  });

    delete user.password_hash;

    return {
      success: true,
      data: { token , user , famer},
      message: "Login successful",
    };
  } catch (error) {
    console.error("Error in login service:", error);
    return { success: false, statusCode: 500, message: "Server error" };
  }
};

// Get one user
const getUser = async (userId) => {
  try {
    const user = await userRepo.findUserById(userId);
    if (!user) {
      return { success: false, statusCode: 404, message: "User not found" };
    }

    return {
      success: true,
      data: user,
      message: "User fetched successfully",
    };
  } catch (error) {
    console.error("Error in fetching user service:", error);
    return { success: false, statusCode: 500, message: "Server error" };
  }
};

// Update user
const updateUser = async (userId, updateData) => {
  try {
    const user = await userRepo.findUserById(userId);
    if (!user) {
      return { success: false, statusCode: 404, message: "User not found" };
    }

    const updatedUser = await userRepo.updateUser(userId, updateData);
    return {
      success: true,
      data: updatedUser,
      message: "User updated successfully",
    };
  } catch (error) {
    console.error("Error in updating user service:", error);
    return { success: false, statusCode: 500, message: "Server error" };
  }
};

// Add to exports
module.exports = {
  registerUser,
  loginUser,
  getUser,
  updateUser,
};