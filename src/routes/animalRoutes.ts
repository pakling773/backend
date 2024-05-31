import express from "express";
import AnimalApiController from "../controllers/api/animalApiController";
import { body } from "express-validator";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      uniqueSuffix + "--" + file.fieldname + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });
// router object
const router = express.Router();

//routes

//get all animals

router.get("/list", AnimalApiController.getAnimals);
router.get("/list_with_details", AnimalApiController.getAnimalsWithDetail);

router.get("/get/:id", AnimalApiController.getAnimalById);
router.post(
  "/save",
  body("name", "name doesnt exists").exists(),
  body("age", "Invalid age").exists().isNumeric(),
  body("color").exists(),
  AnimalApiController.saveAnimal
);

router.put(
  "/update/:id",
  body("name", "name doesnt exists").exists(),
  body("age", "Invalid age").exists().isNumeric(),
  body("color").exists(),
  AnimalApiController.updateAnimal
);

router.delete("/delete/:id", AnimalApiController.deleteAnimal);

router.get("/photos/:id", AnimalApiController.getPhotos);

router.get("/delete/photos/:id", AnimalApiController.deletePhoto);
router.post(
  "/photos/:id",
  upload.array("photos"),
  AnimalApiController.updatePhotos
);

router.post("/search", AnimalApiController.search);

router.get("/similar/:breed_id", AnimalApiController.similarByBreed);

router.get("/facebook-post/:animal_id", AnimalApiController.postFacebook);

router.post(
  "/request",
  body("user_id", "UserID is required").exists(),
  body("animal_id", "Animal id is Required").exists(),
  body("reason", "Reason Is Required").exists(),
  AnimalApiController.saveAnimalRequest
);

router.get("/request", AnimalApiController.getAnimalRequest);
router.get("/resolve/:request_id", AnimalApiController.resolve);



module.exports = router;
