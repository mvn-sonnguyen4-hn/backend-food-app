const { login, register } = require("../services/auth");
const jwt = require("jsonwebtoken");
const userSchema = require("../models/user.model");
const { streamUpload } = require("../utils/upload");

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({
      msg: "Vui long nhap day du thong tin",
    });
  }
  const user = await login({ username, password });
  if (user) {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "48h",
    });
    return res.json({
      jwt: token,
      user,
    });
  }
  return res
    .status(500)
    .json({ msg: "Tai khoan hoac mat khau khong chinh xac" });
};
const registerUser = async (req, res) => {
  const {
    username,
    password,
    email,
    address,
    phonenumber,
    first_name,
    last_name,
  } = req.body;
  if (
    !username ||
    !password ||
    !email ||
    !address ||
    !phonenumber ||
    !first_name ||
    !last_name
  ) {
    return res.json({
      msg: "Vui long nhap day du thong tin",
    });
  }
  const user = await register(req.body);
  if (user) {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "48h",
    });
    return res.json({
      jwt: token,
      user,
      expiresAt: new Date(Date.now() + 3 * 60 * 60 * 60 * 1000),
    });
  }
  if (user === 0) {
    return res.status(402).json({ msg: "User da ton tai" });
  }
  return res.status(500).json({ msg: "Loi server" });
};

const autoLoginUser = async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  if (token) {
    try {
      const result = jwt.verify(token, process.env.JWT_SECRET);
      if (!result) {
        res.status(500).json({
          msg: "Invalid token",
        });
      }
      const user = await userSchema.findOne({ _id: result._id });
      if (user) {
        res.json({
          user,
          jwt: token,
        });
      } else {
        res.status(500).json({
          msg: "Invalid token",
        });
      }
    } catch {
      res.status(500).json({
        msg: "Invalid token",
      });
    }
  } else {
    res.status(500).json({
      msg: "Error",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const {
      email,
      address,
      phonenumber,
      avatar_url,
      first_name,
      last_name,
    } = req.body;
    let result = "";
    if (!avatar_url) {
      result = await streamUpload(req);
    }
    const user = await userSchema.findOneAndUpdate(
      { _id: req.user_id },
      {
        email,
        address,
        avatar_url: avatar_url || result.url,
        phonenumber,
        first_name,
        last_name,
      }, {new: true}
    );
    return res.status(200).json({ data:user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Err" });
  }
};

const getAdmin = async (req, res) => {
  const user = await userSchema.findOne({ role:0 });
  if (user) {
    return res.json({
      user,
    });
  }
  return res.status(500).json({ msg: "Err" });
}

module.exports = { loginUser, registerUser, autoLoginUser, updateUser,getAdmin };
