const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Register a new user
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    // check all fields are filled
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // check existing name
    const existingName = await User.findOne({ where: { name } });
    if (existingName) {
      return res.status(400).json({ message: "Name already in use" });
    }

    // Default role is 'user', but you can change this as needed
    const role = "user";

    const user = await User.create({ email, password, name, role });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ message: "User logged in successfully", token, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    // Simply sending a response to indicate successful logout. Token invalidation would usually be handled on the client-side (e.g., remove token from storage).
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get the user from the bearer token (populated in protect middleware)
    const user = await User.findByPk(req.user.id);
    if (!user) {
      console.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      console.error("Invalid current password");
      return res.status(400).json({ message: "Invalid current password" });
    }

    // Directly set the new password (hashing is done automatically in the beforeUpdate hook)
    user.password = newPassword;

    // Save the updated user (beforeUpdate hook will take care of hashing)
    await user.save();
    // console.log('Password changed successfully');
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const accountInfo = async (req, res) => {
  try {
    // Get the user from the bearer token (populated in protect middleware)
    const user = await User.findByPk(req.user.id);
    if (!user) {
      console.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // send just name, role, email, createdAt in data
    const { name, role, email, createdAt } = user;
    res.status(200).json({ name, role, email, createdAt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateAccountInfo = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Get the user from the bearer token (populated in protect middleware)
    const user = await User.findByPk(req.user.id);
    if (!user) {
      console.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // check if the user tries to change with the same name, email
    if (name === user.name && email === user.email) {
      return res.status(200).json({ message: "No changes detected" });
    }

    // check existing name
    if (name !== user.name) {
      const existingName = await User.findOne({ where: { name } });
      if (existingName) {
        return res.status(400).json({ message: "Name already in use" });
      }
    }

    // check existing email
    if (email !== user.email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    user.name = name;
    user.email = email;

    // Save the updated user
    await user.save();
    res.status(200).json({ message: "Account info updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  logout,
  changePassword,
  accountInfo,
  updateAccountInfo,
};
