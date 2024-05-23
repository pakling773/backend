import express from "express";
import userApiController from "../controllers/api/userApiController";
const router = express.Router();
import { body } from "express-validator";

router.get("/list", userApiController.getUsers);
router.get("/get/:id", userApiController.getUserById);

router.post(
  "/save",
  body("first_name", "name doesnt exists").exists(),
  body("last_name", "required").exists(),
  body("email", "required").isEmail(),
  body("phone", "required").exists(),
  body("address_1", "required").exists(),
  body("password", "required").exists(),

  userApiController.createUser
);

// router.post("/login", userApiController.login);
module.exports = router;
