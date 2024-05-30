import mySqlPool from "../../config/mysql";
import { validationResult } from "express-validator";
import { Request, Response } from "express";
import { isUndefined } from "lodash";
import * as fs from "fs";
import * as path from "path";

class AnimalApiController {
  getAnimals = async (req: Request, res: Response) => {
    try {
      const data = await mySqlPool.query("select * from animals");
      if (!data) {
        res.status(404).send({ success: false, message: "Record not found" });
      }
      res.status(200).json({
        success: true,
        message: "all animal records",
        data: data[0],
        total: (data[0] as any).length,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "unable to get animals", error });
    }
  };

  getAnimalsWithDetail = async (req, res) => {
    try {
      const qry =  "select a.id, a.gender, a.name , a.color, a.price , a.age, a.description  , b.name as breed_name , (select image from images where animal_id = a.id limit 1) as image from animals a left join breed b on a.breed_id = b.id  order by a.id desc ";
      const data = await mySqlPool.query(qry
       
      );
      if (!data) {
        res.status(404).send({ success: false, message: "Record not found" });
      }
      res.status(200).json({
        query:qry,
        success: true,
        message: "all animal records",
        data: data[0],
        total: (data[0] as any).length,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "unable to get animals", error });
    }
  };

  getAnimalById = async (req, res) => {
    try {
      const data = await mySqlPool.query(
        "select * , (select image from images where animal_id = ? limit 1) as image from animals where id = ?",
        [req.params.id, req.params.id]
      );
      if (!data) {
        res.status(404).send({ success: false, message: "Record not found" });
      }
      res.status(200).send({
        success: true,
        message: "all animal records",
        data: data[0],
        total: (data[0] as any).length,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "unable to get animal", error });
    }
  };

  saveAnimal = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors });
    }

    try {
      const {
        name,
        age,
        price,
        color,
        description,
        short_description,
        breed_id,
      } = req.body;

      const data: any = await mySqlPool.query(
        "insert into animals (name,age,price,color,description, short_description,breed_id) values (?,? , ?,?,?,?,?)",
        [name, age, price, color, description, short_description, breed_id]
      );
      if (!data) {
        res.status(404).send({ success: false, message: "error on query" });
      }
      const insert_id = data[0].insertId;
      res.status(200).send({
        success: true,
        message: "New animal created",
        id: insert_id,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "unable to save animal", error });
    }
  };

  updateAnimal = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors });
    }

    try {
      const {
        name,
        age,
        color,
        price,
        description,
        short_description,
        breed_id,
      } = req.body;
      const id = req.params.id;

      const data = await mySqlPool.query(
        "update animals set name =? , age= ? , color = ?  , price =? , description = ? , short_description = ? , breed_id = ? where id =?",
        [name, age, color, price, description, short_description, breed_id, id]
      );
      if (!data) {
        res.status(404).send({ success: false, message: "error on query" });
      }
      res.status(200).send({
        success: true,
        message: "Animal updated successfully",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "unable to save animal", error });
    }
  };

  deleteAnimal = async (req, res) => {
    try {
      const data = await mySqlPool.query("delete from animals where id = ?", [
        req.params.id,
      ]);
      if (!data) {
        res.status(404).send({ success: false, message: "Record not found" });
      }
      res.status(200).send({
        success: true,
        message: "animal deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "unable to delete animal", error });
    }
  };

  updatePhotos = async (req: Request, res: Response) => {
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
      res.status(200).send({
        success: true,
        message: "Images uploaded successfully",
      });
    } catch (error) {
      res
        .status(500)
        .send({ success: false, message: "something went wrong", error });
    }
  };

  async getPhotos(req, res) {
    try {
      const animal_id = req.params.id;
      const data = await mySqlPool.query(
        "select * from images where animal_id = ?",
        [animal_id]
      );
      if (!data) {
        res.status(404).send({ success: false, message: "Record not found" });
      }

      res.status(200).send({
        success: true,
        message: "all images",
        images: data[0],
      });
    } catch (error) {
      res
        .status(500)
        .send({ success: false, message: "something went wrong", error });
    }
  }

  async deletePhoto(req, res) {
    try {
      const id = req.params.id;
      const data = await mySqlPool.query("select * from images where id = ?", [
        id,
      ]);
      if (!data) {
        res.status(404).send({ success: false, message: "Record not found" });
      }

      var _path = path.resolve("./");
      _path = _path + "/src/public/uploads/" + data[0][0]["image"];

      const exists = fs.existsSync(_path);
      if (exists) {
        fs.unlinkSync(_path);
      }

      await mySqlPool.query("delete  from images where id = ?", [id]);

      res.status(200).send({
        success: true,
        message: "Image deleted",
        images: data[0],
      });
    } catch (error) {
      res
        .status(500)
        .send({ success: false, message: "something went wrong", error });
    }
  }

  async search(req, res) {
    const { keyword, breed } = req.body;

    const breeds = breed || [];

    try {
      let query;

      // if (!keyword && !breeds.length) {
      //   query = `select * from animals`;
      // }

      if (keyword && !breeds.length) {
        query = `select *  from animals where name like '%${keyword}%'`;
      }

      if (keyword && breeds.length) {
        query = `select a.* , b.name as breed from animals a   join breed  b on (a.breed_id = b.id) where a.name like '%${keyword}%' and breed_id in (${breeds})`;
      }

      if (!keyword && breeds.length) {
        query = `select a.*, b.name as breed from animals a join breed b on (a.breed_id = b.id) where breed_id in (${breeds}) `;
      }
      console.log(query);
      const data: any = await mySqlPool.query(query);
      const animal_ids: any = [];
      data[0].map(async (row, i) => {
        animal_ids.push(row["id"]);
      });
      var images: any = [];
      if (animal_ids.length) {
        images = await mySqlPool.query(
          `select * from images where animal_id in (${animal_ids}) group by animal_id`
        );
      } else {
        images = [[]];
      }

      res.status(200).send({
        query:query,
        success: true,
        message: "search result",
        animals: data[0],
        images: images[0],
      });
    } catch (error) {
      res.send(error);
      console.log(error);
    }
  }

  async similarByBreed(req, res) {
    // res.send(req.params.breed_id);
    const breed_id = req.params.breed_id;

    const data = await mySqlPool.query(
      "select a.id, a.name, a.breed_id , a.color, a.price , a.age, a.description  , b.name as breed_name , (select image from images where animal_id = a.id limit 1) as image from animals a left join breed b on a.breed_id = b.id  limit 6"
    );

    res.status(200).send({
      success: true,
      message: "similar animals",
      animals: data[0],
    });
  }

  saveAnimalRequest = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors });
    }

    const { user_id, animal_id, reason } = req.body;

    try {
      const data: any = await mySqlPool.query(
        "insert into request (user_id, animal_id, reason) values (?,?,?)",
        [user_id, animal_id, reason]
      );
      if (!data) {
        res.status(404).send({ success: false, message: "error on query" });
      }

      res.status(200).send({
        success: true,
        message: "animal request created",
        animals: data[0],
      });
    } catch (error) {
      res
        .status(500)
        .send({ success: false, message: "something went wrong", error });
    }
  };

  getAnimalRequest = async (req, res) => {
    try {
      const data: any = await mySqlPool.query(
        "select r. id as request_id, r.resolved,  r. animal_id as request_animal_id , r.user_id as requester_id, r.reason, u.firstname as user_first_name, u.lastname as user_lastname, u.phone, u.address_1 , u.address_2 , a.id as ani_animal_id, a.name as ani_animal_name, (select  image from images where animal_id = a.id limit 1) as ani_image from request r join animals a on ( a.id = r.animal_id) join users u on (u.id = r.user_id) order by resolved;"
      );
      if (!data) {
        res.status(404).send({ success: false, message: "error on query" });
      }

      res.status(200).send({
        success: true,
        message: "animal request created",
        requests: data[0],
      });
    } catch (error) {
      res
        .status(500)
        .send({ success: false, message: "something went wrong", error });
    }
  };

  async resolve(req, res) {
    const { request_id } = req.params;

    try {
      const data: any = await mySqlPool.query(
        "update request set resolved = 1 where id = ?",
        [request_id]
      );
      if (!data) {
        res.status(404).send({ success: false, message: "error on query" });
      }

      res.status(200).send({
        success: true,
        message: "Request resolved",
        data: data[0],
      });
    } catch (error) {
      res
        .status(500)
        .send({ success: false, message: "something went wrong", error });
    }
  }
}

export default new AnimalApiController();
