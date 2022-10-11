// const express = require("express");
import express from "express";
// const { validationResult } = require("express-validator");
import { validationResult } from "express-validator";
// const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken";
// require("dotenv").config();
import dotenv from "dotenv";
dotenv.config();
// const mongoose = require("mongoose");
import mongoose from "mongoose";
// const bcrypt = require("bcrypt");
import bcrypt from "bcrypt";

// const { registerValidation } = require("./validations/auth.js");
import { registerValidation } from "./validations/auth.js";

// const userModel = require("./models/User.js");
import user from "./models/User.js";

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

app.post("/auth/register", registerValidation, async (req, res) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return res.status(400).json(validationErrors.array());
  }

  const { password } = req.body;

  const salt = await bcrypt.genSalt(10);

  const passwordHash = await bcrypt.hash(password, salt);

  const doc = new user({
    email: req.body.email,
    fullName: req.body.fullName,
    passwordHash,
  });

  const currentUser = await doc.save();

  res.json({
    success: true,
    currentUser,
  });
});
