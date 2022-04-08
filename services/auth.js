const userSchema = require("../models/user.model");
const bcrypt = require("bcrypt");
const register = async (infoUser) => {
  const {
    first_name,
    last_name,
    email,
    username,
    password,
    address,
    phonenumber,
  } = infoUser;
  const userOld = await userSchema.findOne({ username });
  if (userOld) {
    return 0;
  } else {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return userSchema.create({
      first_name,
      last_name,
      email,
      username,
      password: hash,
      address,
      phonenumber,
    });
  }
};
const login = async (infoUser) => {
  const { username, password } = infoUser;
  const user = await userSchema.findOne({ username });
  if (user) {
    const res = await bcrypt.compare(password, user.password);
    if (res) {
      return user;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

module.exports = { register, login };
