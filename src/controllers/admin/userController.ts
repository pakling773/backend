import mySqlPool from "../../config/mysql";
import { validationResult } from "express-validator";
import { Request, Response } from "express";
import moment from "moment";
import { Encrypt } from "../../library/Encrypt";

class UserController {
  async list(req: Request, res: Response) {
    const result = await mySqlPool.query("select * from users");
    let data = { list: result[0], moment: moment };
    res.render("users/list", data);
  }

  createUser = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { firstname, lastname, email, user_type, password } = req.body;

      const check: any = await mySqlPool.query(
        "select * from users where email = ?",
        [email]
      );
      if (check[0].length !== 0) {
        res
          .status(500)
          .send({ success: false, message: "email already exists" });
        return false;
      }

      const encryptPassword = await Encrypt.cryptPassword(password);

      const query =
        "INSERT INTO users (firstname, lastname, email, user_type, password ) VALUES (?, ?, ?, ?, ?)";

      const [result] = await mySqlPool.query(query, [
        firstname,
        lastname,
        email,
        user_type,
        encryptPassword,
      ]);

      if (result) {
        res.redirect("/admin/users");
      } else {
        return res
          .status(404)
          .send({ success: false, message: "Error creating user" });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      return res
        .status(500)
        .send({ success: false, message: "Unable to create user", error });
    }
  };

  async add(req, res) {
    res.render("users/add");
  }

  deleteUser = async (req: Request, res: Response) => {
    try {
      const data = await mySqlPool.query("delete from users where id = ?", [
        req.params.id,
      ]);
      if (!data) {
        res.status(404).send({ success: false, message: "Record not found" });
      }
      res.redirect("/admin/users");
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "unable to delete user", error });
    }
  };

  getUserById = async (req: Request, res: Response) => {
    try {
      const data = await mySqlPool.query("select * from users where id = ?", [
        req.params.id,
      ]);
      if (!data) {
        res.status(404).send({ success: false, message: "Record not found" });
      }

      let user = { user: data[0][0], edit: true };
      res.render("users/edit", user);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "unable to get animal", error });
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const { firstname, lastname, email, user_type, password } = req.body;
      const { id } = req.params;

      // Check if user exists
      const existingUser = await mySqlPool.query(
        "SELECT * FROM users WHERE id = ?",
        [id]
      );
      if (!existingUser) {
        return res
          .status(404)
          .send({ success: false, message: "User not found" });
      }

      // Perform update
      const result = await mySqlPool.query(
        "UPDATE users SET firstname = ?, lastname = ?, email = ?, user_type = ? WHERE id = ?",
        [firstname, lastname, email, user_type, id]
      );

      // Check if the update was successful
      if (result) {
        res.redirect("/admin/users");
      } else {
        return res
          .status(500)
          .send({ success: false, message: "Failed to update user" });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      return res
        .status(500)
        .send({ success: false, message: "Unable to update user", error });
    }
  };
}

export default new UserController();
