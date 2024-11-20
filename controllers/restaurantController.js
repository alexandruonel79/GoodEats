const Restaurant = require("../models/Restaurant");

// add restaurant
const addRestaurant = async (req, res) => {
  // tie it to the user
  const userId = req.user.id;
  const { name, location, category } = req.body;
  try {
    const restaurant = await Restaurant.create({ name, location, category, userId });
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all restaurants
const getAllRestaurants = async (req, res) => {
  try {
    // all restaurants
    const restaurants = await Restaurant.findAll();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// approve restaurant
const approveRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    restaurant.validated = true;
    await restaurant.save();
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// deny restaurant
const denyRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    restaurant.validated = false;
    await restaurant.save();
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// delete restaurant
const deleteRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    await restaurant.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all approved restaurants by the user
const getAllApprovedRestaurants = async (req, res) => {
  try {
   // all restaurants added by the user
   const userId = req.user.id;
    const restaurants = await Restaurant.findAll({ where: { userId, validated: true } });
    res.status(200).json(restaurants);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all denied restaurants
const getAllDeniedRestaurants = async (req, res) => {
  try {
    // all restaurants added by the user
    const userId = req.user.id;
    const restaurants = await Restaurant.findAll({ where: { userId, validated: false } });
    res.status(200).json(restaurants);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// export functions
module.exports = {
  addRestaurant,
  getAllRestaurants,
  approveRestaurant,
  denyRestaurant,
  deleteRestaurant,
  getAllApprovedRestaurants,
  getAllDeniedRestaurants
};