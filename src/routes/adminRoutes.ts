import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    console.log(file.fieldname);
    cb(
      null,
      uniqueSuffix + "--" + file.fieldname + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

var urlencodedParser = bodyParser.urlencoded({ extended: false });

import loginController from "../controllers/admin/loginController";
import homeController from "../controllers/admin/homeController";
import userController from "../controllers/admin/userController";
import animalController from "../controllers/admin/animalController";

const router = express.Router();
router.get("/", (req, res) => {
  res.redirect("/admin/login");
});
router.get("/logout", loginController.logout);
router.get("/test", urlencodedParser, loginController.test);
router.get("/home", homeController.index);

router.get("/users", userController.list);
router.get("/users/add", userController.add);
router.get("/users/:id", urlencodedParser, userController.getUserById);
router.post("/users/process_user", urlencodedParser, userController.createUser);
router.post(
  "/users/process_user_update/:id",
  urlencodedParser,
  userController.updateUser
);
router.get("/users/delete/:id", urlencodedParser, userController.deleteUser);

// animals
router.get("/animals/photos/:id", animalController.photos);
router.post(
  "/animals/photos/save/:id",
  upload.array("images"),
  urlencodedParser,
  animalController.uploadPhotos
);

router.get(
  "/animals/photos/delete/:animal_id/:photo_id",
  animalController.photoDelete
);
router.get("/animals", animalController.getAnimalList);
router.get("/animals/add", animalController.addAnimal);
router.get("/animals/:id", urlencodedParser, animalController.getAnimalById);
router.post("/animals/create", urlencodedParser, animalController.createAnimal);
router.get(
  "/animals/delete/:id",
  urlencodedParser,
  animalController.deleteAnimal
);
router.post(
  "/animals/update/:id",
  urlencodedParser,
  animalController.updateAnimal
);

module.exports = router;
