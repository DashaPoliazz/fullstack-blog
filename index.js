import express from "express";

import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

import * as userController from "./controllers/UserController.js";

import { registerValidation } from "./validations/auth.js";

import checkAuth from "./utils/checkAuth.js";

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

app.post("/auth/register", registerValidation, userController.register);

app.post("/auth/login", userController.login);

app.get("/auth/me", checkAuth, userController.getMe);
