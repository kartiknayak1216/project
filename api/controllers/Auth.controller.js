import errorHandler from "../utils/Error.js";
import User from "../modules/User.module.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
const bcryptCostFactor = 10;

import dotenv from "dotenv";
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return next(errorHandler(401, "Invalid credentials"));
  }

  // Email validation
  if (!validator.isEmail(email)) {
    return next(errorHandler(401, "Invalid email format"));
  }

  // Password validation
  const passwordRegex = /^.{4,}$/;

  if (!passwordRegex.test(password)) {
    return next(
      errorHandler(401, "Password must have min 4 character and number")
    );
  }

  const name = await User.findOne({ username });
  if (name) {
    return next(errorHandler(404, "Username already exists"));
  }

  const mail = await User.findOne({ email });
  if (mail) {
    return next(errorHandler(404, "Email already exists"));
  }

  try {
    const hashpassword = bcrypt.hashSync(password, bcryptCostFactor);
    const user = await User({
      username,
      email,
      password: hashpassword,
    });
    await user.save();
    res.status(201).json({ message: "User created successfully", user: user });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(401, "Invalid credentials"));
  }

  // Email validation
  if (!validator.isEmail(email)) {
    return next(errorHandler(401, "Invalid email format"));
  }

  // Password validation
  const passwordRegex = /^.{4,}$/;

  if (!passwordRegex.test(password)) {
    return next(
      errorHandler(
        401,
        "Password must have a minimum of 4 characters and include a number"
      )
    );
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(errorHandler(404, "Email does not exist"));
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return next(errorHandler(401, "Invalid password"));
    }

    // Generate and sign a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = user._doc;

    // Set the token as an HTTP-only cookie
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    console.error("Error during signin:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password, ...rest } = user.toObject();
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username: `user${Math.random().toString(36).slice(-4)}`,
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password, ...rest } = newUser.toObject();
      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    console.error("Error during Google OAuth:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Helper function to generate a random password
const generateRandomPassword = () => {
  const length = 12;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};
