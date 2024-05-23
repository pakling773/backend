// get all animal list

import mySqlPool from "../../config/mysql";
import { validationResult } from "express-validator";
import { Request, Response } from "express";
import { Encrypt } from "../../library/Encrypt";
import "dotenv/config";

// var jwt = require("jsonwebtoken");

import * as jwt from "jsonwebtoken";

class UserApiController {
  getUsers = async (req, res) => {
    try {
      const data = await mySqlPool.query("select * from users");
      if (!data) {
        res.status(404).send({ success: false, message: "Record not found" });
      }
      res.status(200).send({
        success: true,
        message: "all users records",
        data: data[0],
        total: (data[0] as any).length,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "unable to get users", error });
    }
  };

  getUserById = async (req, res) => {
    try {
      const data = await mySqlPool.query("select * from users where id = ?", [
        req.params.id,
      ]);
      if (!data) {
        res.status(404).send({ success: false, message: "Record not found" });
      }
      res.status(200).send({
        success: true,
        message: "all user records",
        data: data[0],
        total: (data[0] as any).length,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "unable to get user", error });
    }
  };

  createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors });
    }

    try {
      const {
        first_name,
        last_name,
        email,
        user_type,
        password,
        phone,
        address_1,
        address_2,
      } = req.body;

      const data = await mySqlPool.query(
        "insert into users (firstname,lastname,email,user_type,password,phone,address_1, address_2) values (?,?,?,?,?,?,?,?)",
        [first_name, last_name, email, 0, password, phone, address_1, address_2]
      );
      if (!data) {
        res.status(404).send({ success: false, message: "error on query" });
      }
      res.status(200).send({
        success: true,
        message: "New User Created",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "unable to create user", error });
    }
  };

  updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors });
    }

    try {
      const { name, age, color, description } = req.body;
      const id = req.params.id;

      const data = await mySqlPool.query(
        "update users set name =? , age= ? , color = ? , description = ? where id =?",
        [name, age, color, description, id]
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

  deleteUser = async (req, res) => {
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
}

export default new UserApiController();
