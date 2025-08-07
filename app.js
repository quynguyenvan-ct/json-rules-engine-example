const express = require("express");
const app = express();
app.use(express.json());

const postRoutes = require("./routes/postRoutes");
app.use("/", postRoutes);
app.listen(3000, () => console.log("🔥 Server chạy ở http://localhost:3000"));
