const express = require("express");
const router = express.Router();
const posts = require("../data/posts.json");
const { canAccess } = require("../utils/auth");

router.post("/posts/:id", canAccess, (req, res) => {
  const post = posts.find((p) => p.id == req.params.id);
  res.json(post);
});

router.put("/posts/:id", canAccess, (req, res) => {
  res.send("Đã cập nhật post (giả lập)");
});

module.exports = router;
