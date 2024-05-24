const e = require("express");
const prisma = require("../models");
const customError = require("../utils/customError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const tryCatch = require("../utils/tryCatch");

const register = tryCatch(async (req, res, next) => {
  // รับ body {username,password,conFirmPassword,email}
  const { username, password, confirmPassword, email } = req.body;
  // validation
  // if (!username || !password || !conFirmPassword) {
  if (!username || !password || !confirmPassword) {
    // const error = new Error("Fill all Input");
    // error.statusCode = 400;
    return next(customError("Fill all Input", 400));
  }
  if (password !== confirmPassword) {
    throw customError("check confirmPassword", 400);
  }
  // find user in db
  const userExist = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (userExist) {
    throw customError("User already exist", 400);
  }
  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  const data = { username, password: hashedPassword, email };
  // INSERT INTO user ใน prisma.user
  const rs = await prisma.user.create({ data: data });
  console.log(rs);
  res.status(200).json({ message: "Register successful" });

  // res.json({ message: "in register.." });
});

const login = tryCatch(async (req, res, next) => {
  const { username, password } = req.body;

  // validation
  if (!username || !password) {
    return next(customError("Fill all Input", 400));
  }
  const foundUser = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  // find username in prisma.user
  if (!foundUser) {
    return next(customError("Invalid login", 400));
  }
  // check password
  const pwOk = await bcrypt.compare(password, foundUser.password);
  if (!pwOk) {
    return next(customError("Invalid login", 400));
  }
  // generate jwt-token
  // make payload = {id,username}
  // jwt.sign + {expireIns:30d}
  const payload = { id: foundUser.id };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
  console.log(token);
  // response jwt-token

  res.json({ message: "login successful" });
});
const me = (req, res, next) => {
  res.json({ message: "in getMe" });
};

module.exports = { register, login, me };
