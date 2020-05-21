const jwt = require("jsonwebtoken");
const secret = process.env.secret;

//user token verificaton
const verifyToken = (req, res, next) => {
  let bearerHeader = req.headers["authorization"];
  let bearerToken = bearerHeader.split(" ")[1];
  jwt.verify(bearerToken, secret, (err, decoded) => {
    if (err) {
      res.json({ error: err });
    } else {
      req.user = decoded.data;
      next();
    }
  });
};

module.exports = verifyToken;