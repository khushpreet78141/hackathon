// /models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
      index: true
    },

    password: {
      type: String,
      required: true,
      select: false // never return by default
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    totalAnalyses: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", userSchema);