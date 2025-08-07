const { checkPermission } = require("../engine/permissionEngine");
const posts = require("../data/posts.json");

async function canAccess(req, res, next) {
  console.log("BODY:", req.body);

  const postId = parseInt(req.params.id);
  const post = posts.find((p) => p.id === postId);
  if (!post) return res.status(404).send("Không tìm thấy post");

  const facts = {
    userId: Number(req.body.userId),
    postOwnerId: post.userId,
    role: req.body.role,
    action: req.method === "PUT" ? "edit" : "read",
    resource: "post",
  };
  console.log("🔍 Checking permissions with facts:", facts);
  const allowed = await checkPermission(facts);
  if (!allowed) return res.status(403).send("Bạn không có quyền");
  next();
}

module.exports = { canAccess };
