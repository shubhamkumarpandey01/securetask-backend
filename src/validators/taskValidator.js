import { body } from "express-validator";

export const taskValidator = [
  body("title")
    .notEmpty()
    .withMessage("Title is required"),

  body("description")
    .notEmpty()
    .withMessage("Description is required"),

  body("priority")
    .isIn(["Low", "Medium", "High"])
    .withMessage("Priority must be Low, Medium or High"),

  body("status")
    .isIn(["Pending", "In Progress", "Completed"])
    .withMessage("Invalid status"),
];