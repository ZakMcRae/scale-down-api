const jwt = require("jsonwebtoken");

// extracts userId and sets on req.userId if token sent in header
//
// can be used to check if authorized on routes
// i.e. if !(req.userId) return res.status(401).send('Unauthorized')
const setUserFromToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader === undefined) {
      return next();
    }

    const tokenPayload = await jwt.verify(
      authHeader.slice(7),
      process.env.JWT_SECRET
    );
    req.userId = tokenPayload.user;

    next();
  } catch (err) {
    return res.status(500).send("Something went wrong");
  }
};

module.exports = setUserFromToken;
