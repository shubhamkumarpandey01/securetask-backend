import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import {
  registerValidator,
  loginValidator,
} from "../validators/authValidator.js";
import { validateRequest } from "../middleware/errorMiddleware.js";

const router = express.Router();

router.post("/register", registerValidator, validateRequest, registerUser);
router.post("/login", loginValidator, validateRequest, loginUser);

export default router;