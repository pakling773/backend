import express from "express";
const app = express();
const router = express.Router();

/**
 * API ROUTING
 */

router.use("/animal", require("./animalRoutes"));

router.use("/breed", require("./breedRoutes"));
router.use("/users", require("./userRoutes"));

module.exports = router;
