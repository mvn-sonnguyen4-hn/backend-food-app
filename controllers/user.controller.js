const { login, register } = require("../services/auth");
const jwt = require("jsonwebtoken");
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json({
      msg: "Vui long nhap day du thong tin",
    });
  }
  const user = await login({ username, password });
  console.log(user);
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
    });
  }
  if (user === 0) {
    return res.status(402).json({ msg: "User da ton tai" });
  }
  return res.status(500).json({ msg: "Loi server" });
};
module.exports = { loginUser, registerUser };
