import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import userModel from "../models/User.js";

export const register = async (req, res) => {
  try {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(400).json(validationErrors.array());
    }

    const { password } = req.body;

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const doc = new userModel({
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash: hashedPassword,
    });

    const currentUser = await doc.save();

    const token = jwt.sign(
      {
        _id: currentUser._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = currentUser._doc;

    res.json({
      userData,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: `Can not create new user. Error: ${error}`,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundedUser = await userModel.findOne({
      email,
    });

    if (!foundedUser) {
      return res.status(404).json({
        message: "User does not exist",
      });
    }

    const isValidPass = await bcrypt.compare(
      password,
      foundedUser._doc.passwordHash
    );

    if (!isValidPass) {
      return res.status(404).json({
        message: "Wrong login or password",
      });
    }

    const token = jwt.sign(
      {
        _id: foundedUser._id,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = foundedUser._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(`Unavailable to authorize user. Error: ${error}`);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
    });
  } catch (error) {
    console.log(`Unavailable to authorize user. Error: ${error}`);
  }
};
