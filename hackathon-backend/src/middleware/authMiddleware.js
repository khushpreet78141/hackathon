import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { AppError } from "./errorHandler.js";

/*
========================
PROTECT ROUTES
Verifies JWT token
========================
*/

export const protect = async (req, res, next) => {
  let token;

  // 1) Check Authorization header or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError("Not authorized, no token", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError("Not authorized, token failed", 401));
  }
};

/**
 * Optional protection: populates req.user if token is present, 
 * but does not prevent access if it's missing.
 */
export const optionalProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (user) {
      req.user = user;
    }
  } catch (error) {
    // Ignore invalid token in optional mode
  }

  next();
};


/*
========================
AUTHORIZE ROLES
Restrict access by role
========================
*/
// ... (authorize function remains the same)

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