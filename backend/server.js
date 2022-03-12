const express = require("express");
const app = express();
require("dotenv").config();
const db = require("./models");

// Routers
const userRoute = require("./routes/User");
app.use("/user", userRoute);

const postRoute = require("./routes/Post");
app.use("/post", postRoute);

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
