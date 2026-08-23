const jwt = require("jsonwebtoken");

export const getUserFromAuthHeader = async (authHeader, secret) => {
  const exists = authHeader && authHeader.startWith("Bearer ");
  if (exists) {
    const decoded = jwt.verify(authHeader.substring(7), secret);
    return await User.findById(decoded.id);
  }
  return {};
};
