const customError = require("../utils/customError");
const tryCatch = require("../utils/tryCatch");
const jwt = require("jsonwebtoken");
const prisma = require("../models");

module.exports = tryCatch(async (req, res, next) => {
  // check req.headers -- have Authorization
  const authorization = req.headers.authorization;
  if (!authorization) {
    throw customError("UnAuthorized", 401);
  }
  if (!/^Bearer /.test(authorization)) {
    throw customError("UnAuthorized", 401);
  }
  // check token
  const token = authorization.split(" ")[1];
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  console.log(payload);
  // use payload find user in prisma.user
  const user = await prisma.user.findUnique({
    where: {
      id: payload.id,
    },
  });
  delete user.password;
  console.log(user);
  req.user = user;
  next();
});
