import express from "express";
import { createContact } from "../Controllers/contactController.js";

const router = express.Router();

router.post("/", createContact);

export default router;