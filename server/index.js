const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.route");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
userRoutes(app);

//Database connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to Database");
    //server
    app.listen(port, () => {
      console.log(`Server started at : ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
