import mySqlPool from "../../config/mysql";
import { validationResult } from "express-validator";

class BreedController {
  async getAllBreeds(req, res) {
    try {
      const data = await mySqlPool.query("select * from breed");
      if (!data) {
        res.status(404).send({ success: false, message: "Record not found" });
      }
      res.status(200).send({
        success: true,
        message: "all breed records",
        data: data[0],
        total: (data[0] as any).length,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "unable to get breed", error });
    }
  }

  async getBreedById(req, res) {
    try {
      const id = req.params.id;
      const data = await mySqlPool.query("select * from breed where id = ? ", [
        id,
      ]);
      if (!data) {
        res.status(404).send({ success: false, message: "Record not found" });
      }
      res.status(200).send({
        success: true,
        message: "all breed records",
        data: data[0],
        total: (data[0] as any).length,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "unable to get breed", error });
    }
  }
  async saveBreed(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors });
    }

    try {
      const { name } = req.body;

      const data = await mySqlPool.query(
        "insert into breed (name) values (?)",
        [name]
      );
      if (!data) {
        res.status(404).send({ success: false, message: "error on query" });
      }
      res.status(200).send({
        success: true,
        message: "New breed created",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "unable to save breed", error });
    }
  }

  async updateBreed(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors });
    }

    try {
      const id = req.params.id;
      const { name } = req.body;

      const data = await mySqlPool.query(
        "update breed set name = ? where id = ?",
        [name, id]
      );
      if (!data) {
        res.status(404).send({ success: false, message: "error on query" });
      }
      res.status(200).send({
        success: true,
        message: "breed updated",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "unable to update breed", error });
    }
  }

  async deleteBreed(req, res) {
    const id = req.params.id;
    try {
      const data = await mySqlPool.query("delete from breed where id = ?", [
        id,
      ]);
      if (!data) {
        res.status(404).send({ success: false, message: "Record not found" });
      }
      res.status(200).send({
        success: true,
        message: "breed deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "unable to delete breed", error });
    }
  }
}

export default new BreedController();
