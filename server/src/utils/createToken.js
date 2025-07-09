const jwt = require("jsonwebtoken");

const createToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

module.exports = createToken;
