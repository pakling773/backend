import mySqlPool from "../../config/mysql";

import { Response, Request } from "express";
import { validationResult } from "express-validator";

import AnimalApiController from "../api/animalApiController";
import facebookService from "../../services/facebookService";


class AnimalController {
  // Method to get animal list
  getAnimalList = async (req: Request, res: Response) => {
    try {
      const result = await mySqlPool.query("select * from animals");
      if (!result) {
        res.status(404).send({ success: false, message: "Record not found" });
      }
      const data = { animals: result[0] };
      res.render("animals/list", data);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "unable to get animals", error });
    }
  };

  // Method to get animal by ID
  getAnimalById = async (req: Request, res: Response) => {
    try {
      const data = await mySqlPool.query("select * from animals where id = ?", [
        req.params.id,
      ]);

      const breedsResult = await mySqlPool.query("select * from breed");
      if (!breedsResult) {
        res.status(404).send({ success: false, message: "Record not found" });
      }

      if (!data) {
        res.status(404).send({ success: false, message: "Record not found" });
      }

      let animal = { animal: data[0][0], breeds: breedsResult[0] };
      res.render("animals/edit", animal);
    } catch (error) {
      console.error("Error fetching animal by ID:", error);
      res.status(500).json({
        success: false,
        message: "Unable to fetch animal by ID",
        error,
      });
    }
  };

  addAnimal = async (req: Request, res: Response) => {
    try {
      const result = await mySqlPool.query("select * from breed");
      if (!result) {
        res.status(404).send({ success: false, message: "Record not found" });
      }
      const data = { breeds: result[0] };
      res.render("animals/add", data);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "unable to get animals", error });
    }
  };

  createAnimal = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors });
    }

    try {
      const { name, age, color, breed_id, description, short_description } =
        req.body;

      const data = await mySqlPool.query(
        "insert into animals (name, age, color, breed_id, description, short_description) values (?,?,?,?,?,?)",
        [name, age, color, breed_id, description, short_description]
      );
      if (!data) {
        res.status(404).send({ success: false, message: "error on query" });
      }
      res.redirect("/admin/animals");
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "unable to save animal", error });
    }
  };

  updateAnimal = async (req: Request, res: Response) => {
    try {
      const { name, color, age, breed_id, description, short_description } =
        req.body;
      const { id } = req.params;

      // Check if animals exists
      const existingAnimal = await mySqlPool.query(
        "SELECT * FROM animals WHERE id = ?",
        [id]
      );
      if (!existingAnimal) {
        return res
          .status(404)
          .send({ success: false, message: "User not found" });
      }

      // Perform update
      const result = await mySqlPool.query(
        "UPDATE animals SET name = ?, color = ?, age = ?, breed_id = ?, description = ?, short_description = ? WHERE id = ?",
        [name, color, age, breed_id, description, short_description, id]
      );

      // Check if the update was successful
      if (result) {
        res.redirect("/admin/animals");
      } else {
        return res
          .status(500)
          .send({ success: false, message: "Failed to update animals" });
      }
    } catch (error) {
      console.error("Error updating animals:", error);
      return res
        .status(500)
        .send({ success: false, message: "Unable to update animals", error });
    }
  };

  deleteAnimal = async (req: Request, res: Response) => {
    try {
      const data = await mySqlPool.query("delete from animals where id = ?", [
        req.params.id,
      ]);
      if (!data) {
        res.status(404).send({ success: false, message: "Record not found" });
      }
      res.redirect("/admin/animals");
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "unable to delete animals", error });
    }
  };

  async photos(req, res) {
    const animal_id = req.params.id;
    const image_data = await mySqlPool.query(
      "select * from images where animal_id = ?",
      [animal_id]
    );

    const ainmal_data = await mySqlPool.query(
      "select * from   animals where id = ?",
      [animal_id]
    );
    const data = { animal: ainmal_data[0][0], images: image_data[0] };

    res.render("animals/images", data);
    // res.send(data);
  }

  async uploadPhotos(req, res) {
    if (!req.files?.length) {
      res.status(413).send("File not uploaded!");
      return;
    }

    try {
      const files: any = req.files;
      const id = req.params.id;

      const total = req.files.length;

      for (let i = 0; i <= files.length - 1; i++) {
        const data = await mySqlPool.query(
          "INSERT INTO `images` ( `image`, `animal_id`) VALUES (  ?, ?)",
          [files[i].filename, id]
        );
      }
      res.redirect("/admin/animals/photos/" + id);
    } catch (error) {
      res
        .status(500)
        .send({ success: false, message: "something went wrong", error });
    }
  }

  async photoDelete(req, res) {
    const photo_id = req.params.photo_id;
    const ainmal_data = await mySqlPool.query(
      "delete  from   images where id = ?",
      [photo_id]
    );
    res.redirect("/admin/animals/photos/" + req.params.animal_id);
  }


  async postToFB(req, res) {
      
    try {
      await facebookService.postToFB(req, res);
    } catch (error) {}
    res.redirect("/admin/animals");
  }
}

export default new AnimalController();
