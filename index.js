const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect(process.env.MONGODB_CONNECTION_LINK)
  .then(console.log("Successfully connected to MongoDB"))
  .catch((error) =>
    console.log(`Unavailable to connect to MongoDB. Error: ${error}`)
  );

// JSON middleware
app.use(express.json());

const PORT = process.env.PORT;

app.listen(PORT, (error) => {
  if (error) {
    console.log(`Server has not been started. Erorr: ${error}`);
  }

  console.log(`Server has been started successfully on port ${PORT}`);
});

app.post("/auth/login", (req, res) => {
  const { email, fullName } = req.body;

  const token = jwt.sign(
    {
      email,
      fullName,
    },
    "key"
  );

  res.json({
    success: true,
    token,
  });
});
