const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("In todoRoute get /");
  console.log(req.user);
  res.json({ msg: `Hello, ${req.user.username}` });
});
router.post("/", () => {});
router.put("/:id", () => {});
router.delete("/:id", () => {});
router.get("/all-status", () => {});

module.exports = router;
