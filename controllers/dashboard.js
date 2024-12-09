const Restaurant = require("../models/Restaurant");
const User = require("../models/User");
const Post = require("../models/Post");
const Log = require("../models/Log");

const getDashboardData = async (req, res) => {
  try {
    // get total users count, restaurants count, and posts count
    const usersCount = await User.count();
    const restaurantsCount = await Restaurant.count();
    const postsCount = await Post.count();

    res.status(200).json({ usersCount, restaurantsCount, postsCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// get all logs
const getAllLogs = async (req, res) => {
  try {
    const logs = await Log.findAll();
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// function to log messages
const logMessage = async (message, level) => {
  try {
    await Log.create({ message, level });
  } catch (error) {
    console.error(error);
  }
};


module.exports = { getDashboardData, getAllLogs, logMessage };
