require("dotenv").config();
const express = require("express");
const notFound = require("./middlewares/not-found");
const errorMiddleWare = require("./middlewares/error-middleware");
const authRoute = require("./routes/auth-route");
const todoRoute = require("./routes/todo-route");
const app = express();
const authenticate = require("./middlewares/authenticate");
app.use(express.json());

app.use("/auth", authRoute);
app.use("/todos", authenticate, todoRoute);

app.use(notFound);
app.use(errorMiddleWare);

let port = process.env.PORT || 8000;
app.listen(port, () => console.log("Server on", port));
