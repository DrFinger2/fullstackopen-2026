const jwt = require("jsonwebtoken");
const User = require("../models/UserModel.js");

const getUserFromAuthHeader = async (authHeader, secret) => {
  const exists = authHeader && authHeader.startsWith("Bearer ");
  if (exists) {
    const decoded = jwt.verify(authHeader.substring(7), secret);
    return await User.findById(decoded.id);
  }
  return null;
};

module.exports = getUserFromAuthHeader;
