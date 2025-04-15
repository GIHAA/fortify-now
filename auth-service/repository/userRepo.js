// repository/userRepo.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Function to find a user by email
const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

// Function to create a new user
const createUser = async (username, email, hashedPassword , role) => {
  return await User.create({ username, email, password_hash: hashedPassword , role });
};

// find all users
const findAllUsers = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  
  const { count, rows } = await User.findAndCountAll({
    attributes: ['id', 'username', 'email', 'role'],
    limit: limit,
    offset: offset,
    order: [['createdAt', 'DESC']] 
  });

  return {
    users: rows,
    totalUsers: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  };
};

// Find user by ID with associated data if FARMER
const findUserById = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'username', 'email', 'role']
  });

  return user;
};

// Update user and related details if FARMER
const updateUser = async (userId, updateData) => {
  const user = await User.findByPk(userId);
  if (!user) return null;

  const {
    username,
    email
  } = updateData;

  // Update basic user info
  if (username || email) {
    await user.update({
      username: username || user.username,
      email: email || user.email
    });
  }

  // Return updated user with all related data
  return await findUserById(userId);
};

// Add to exports
module.exports = {
  findUserByEmail,
  createUser,
  findAllUsers,
  findUserById,
  updateUser
};