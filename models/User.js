const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'validated_user', 'admin'),
    defaultValue: 'user',
  },
  profilePicturePath: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'default.jpg',
  },
}, {
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10); // Hash password before creating user
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) { // Check if password is being updated
        user.password = await bcrypt.hash(user.password, 10); // Hash new password before saving
      }
    },
  },
});

// Compare password during login
User.prototype.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;