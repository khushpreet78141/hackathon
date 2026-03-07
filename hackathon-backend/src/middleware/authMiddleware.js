import jwt from "jsonwebtoken";
import User from "../models/user.js";
import  {AppError} from "./errorHandler.js";

/*
========================
PROTECT ROUTES
Verifies JWT token
========================
*/

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {

      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // fetch user from database
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new AppError("User not found", 404));
      }

      req.user = user;

      next();

    } catch (error) {
      return next(new AppError("Not authorized, token failed", 401));
    }
  }

  if (!token) {
    return next(new AppError("Not authorized, no token", 401));
  }
};



/*
========================
AUTHORIZE ROLES
Restrict access by role
========================
*/

export const authorize = (...roles) => {
  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Role ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
};