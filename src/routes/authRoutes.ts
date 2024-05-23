import express from "express";
import authApiController from "../controllers/api/authApiController";
import loginController from "../controllers/admin/loginController";
const router = express.Router();
import bodyParser from "body-parser";

var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post("/login", authApiController.login);
router.post("/register", authApiController.register);
router.get("/admin/login", loginController.loginForm);
router.post(
  "/admin/process_login",
  urlencodedParser,
  loginController.processLogin
);

module.exports = router;
