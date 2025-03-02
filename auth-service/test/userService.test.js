// test/userService.test.js
const userService = require("../service/userService");
const userRepo = require("../repository/userRepo");
const FarmerDetails = require("../models/FarmerDetails");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Mock dependencies
jest.mock("../repository/userRepo");
jest.mock("../models/FarmerDetails");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should successfully register a new user", async () => {
      const mockUser = {
        id: 1,
        username: "testuser",
        email: "test@test.com",
      };

      userRepo.findUserByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedPassword");
      userRepo.createUser.mockResolvedValue(mockUser);

      const result = await userService.registerUser(
        "testuser",
        "test@test.com",
        "password123"
      );

      expect(result).toEqual({
        success: true,
        data: { id: 1, username: "testuser", email: "test@test.com" },
        message: "User created successfully",
      });
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    });

    it("should return error for existing user", async () => {
      userRepo.findUserByEmail.mockResolvedValue({ id: 1 });

      const result = await userService.registerUser(
        "testuser",
        "test@test.com",
        "password123"
      );

      expect(result).toEqual({
        success: false,
        statusCode: 400,
        message: "User already exists",
      });
    });
  });

  describe("loginUser", () => {
    it("should successfully login user", async () => {
      const mockUser = {
        id: 1,
        email: "test@test.com",
        username: "testuser",
        password_hash: "hashedPassword",
      };

      const mockFarmer = {
        age: 30,
        vision_problems: false,
        color_blindness: false,
      };

      userRepo.findUserByEmail.mockResolvedValue(mockUser);
      FarmerDetails.findOne.mockResolvedValue(mockFarmer);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("mockToken");

      const result = await userService.loginUser(
        "test@test.com",
        "password123"
      );

      expect(result).toEqual({
        success: true,
        data: {
          famer: {
            age: 30,
            color_blindness: false,
            vision_problems: false,
          },
          token: "mockToken",
          user: {
            email: "test@test.com",
            id: 1,
            username: "testuser",
          },
        },

        message: "Login successful",
      });
    });

    it("should return error for non-existent user", async () => {
      userRepo.findUserByEmail.mockResolvedValue(null);

      const result = await userService.loginUser(
        "test@test.com",
        "password123"
      );

      expect(result).toEqual({
        success: false,
        statusCode: 404,
        message: "User not found",
      });
    });

    it("should return error for invalid password", async () => {
      userRepo.findUserByEmail.mockResolvedValue({
        id: 1,
        password_hash: "hashedPassword",
      });
      bcrypt.compare.mockResolvedValue(false);

      const result = await userService.loginUser(
        "test@test.com",
        "wrongpassword"
      );

      expect(result).toEqual({
        success: false,
        statusCode: 400,
        message: "Invalid password",
      });
    });
  });

});
