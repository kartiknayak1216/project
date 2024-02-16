import User from "../modules/User.module.js";
import errorHandler from "../utils/Error.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";

export const deleteuser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, "Unauthorized"));
  }

  try {
    // Use findByIdAndDelete instead of findOneByIdAndDelete
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};
// Assuming your errorHandler function is defined somewhere

export const update = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      return next(errorHandler(401, "Unauthorized: User ID mismatch"));
    }

    let updateFields = {
      username: req.body.username,
      email: req.body.email,
      profile: req.body.profile,
    };

    if (req.body.password) {
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
      updateFields.password = hashedPassword;
    }

    // check username
    // check username
    if (req.body.username && req.body.username !== req.user.username) {
      const existingUsername = await User.findOne({
        username: req.body.username,
      });
      if (existingUsername && existingUsername._id !== req.params.id) {
        return next(errorHandler(409, "Username already exists"));
      }
    }

    // Check if email is provided and has been changed
    if (req.body.email && req.body.email !== req.user.email) {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser && existingUser._id !== req.params.id) {
        return next(errorHandler(409, "Email already exists"));
      }

      // Validate email format
      if (!validator.isEmail(req.body.email)) {
        return next(errorHandler(401, "Invalid email format"));
      }
    }

    const passwordRegex = /^.{4,}$/;

    if (req.body.password && !passwordRegex.test(req.body.password)) {
      return next(
        errorHandler(
          401,
          "Password must have at least 4 characters and include a number"
        )
      );
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!user) {
      return next(errorHandler(404, "User not found"));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    const { password, ...rest } = user._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    console.error("Error during user update:", error);
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(errorHandler(404, "User not found!"));

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
