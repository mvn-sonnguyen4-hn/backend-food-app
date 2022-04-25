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
      req.user_id = decode._id;
      next();
      return;
    });
  } else {
    return res.status(401).send({ message: "Token is not supplied." });
  }
};

const isAdmin = async (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
        if (err) {
          return res.status(401).send({ message: "Invalid Token" });
        }
        const user = await userSchema.findOne({ _id: decode._id });
        if (user && user.role === 0) {
          req.user_id=decode._id
          next();
        } else {
          res.status(401).send({ message: "You are not admin" });
        }
      });
    } catch {
      res.status(401).send({ message: "Invalid Token" });
    }
  } else {
    return res.status(401).send({ message: "Token is not supplied." });
  }
};

module.exports = { getToken, isAuth, isAdmin };
