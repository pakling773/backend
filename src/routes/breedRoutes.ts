import express from "express";
import BreedController from "../controllers/api/breedApiController";
import { body } from "express-validator";
const router = express.Router();

router.get("/list", BreedController.getAllBreeds);
router.get("/get/:id", BreedController.getBreedById);
router.post(
  "/save",
  body("name", "name doesnt exists").exists(),

  BreedController.saveBreed
);

router.put(
  "/update/:id",
  body("name", "name doesnt exists").exists(),
  BreedController.updateBreed
);

router.delete("/delete/:id", BreedController.deleteBreed);

module.exports = router;
