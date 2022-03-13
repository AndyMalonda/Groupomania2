const express = require("express");
const app = express();
require("dotenv").config();
const db = require("./models");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Routers
const userRouter = require("./routes/Users");
app.use("/users", userRouter);

const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);

const commentRouter = require("./routes/Comments");
app.use("/comments", commentRouter);

// App()
db.sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
