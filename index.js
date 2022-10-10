const express = require("express");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mongoose = require("mongoose");
const { registerValidation } = require("./validations/auth.js");

mongoose
  .connect(process.env.MONGODB_CONNECTION_LINK)
  .then(console.log("Successfully connected to MongoDB"))
  .catch((error) =>
    console.log(`Unavailable to connect to MongoDB. Error: ${error}`)
  );

const app = express();

// JSON middleware
app.use(express.json());

const PORT = process.env.PORT;

app.listen(PORT, (error) => {
  if (error) {
    console.log(`Server has not been started. Erorr: ${error}`);
  }

  console.log(`Server has been started successfully on port ${PORT}`);
});

app.post("/auth/register", registerValidation, (req, res) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return res.status(400).json(validationErrors.array());
  }

  res.json({
    success: true,
  });
});
