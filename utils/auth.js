const userSchema = require("../models/user.model");
const jwt = require("jsonwebtoken");
const getToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "48h",
  });
};
const isAuth = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({ message: "Invalid Token" });
      }
      req.user = decode;
      next();
      return;
    });
  } else {
    return res.status(401).send({ message: "Token is not supplied." });
  }
};

const isAdmin = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (token) {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      if (decode) {
        const user = await userSchema.findOne({ _id: decode._id });
        if (user && user.role === 0) {
          return next();
        }
      }
    }
  }
  return res.status(500).json({ message: "You are not admin" });
};

module.exports = { getToken, isAuth, isAdmin };
