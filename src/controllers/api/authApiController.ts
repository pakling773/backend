import { Encrypt } from "../../library/Encrypt";
import mySqlPool from "../../config/mysql";
import * as jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

class AuthApiController {
  login = async (req, res) => {
    const { email, password } = req.body;

    try {
      const data = await mySqlPool.query(
        "select * from users where email = ?",
        [email]
      );
      if (!data) {
        res.status(404).send({ success: false, message: "User not found" });
        return false;
      }

      if (!data[0][0]) {
        res.status(404).send({ success: false, message: "User not found" });
        return false;
      }

      const user = data[0][0];
      console.log(user);

      const compare = await Encrypt.comparePassword(password, user.password);
      if (!compare) {
        res.status(404).send({ success: false, message: "Invalid login" });
        return false;
      }

      var token = jwt.sign(
        {
          id: user.id,
        },
        process.env.API_SECRET,
        {
          expiresIn: "12 days",
        }
      );

      res.status(200).send({
        user: {
          id: user.id,
          email: user.email,
          firstname: user.first_name,
          lastname: user.last_name,
          user_type: user.user_type,
        },
        message: "Login successfull.",
        accessToken: token,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "unable to delete animal", error });
    }
  };

  register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors });
    }

    try {
      const {
        firstname,
        lastname,
        email,
        password,
        phone,
        address_1,
        address_2,
      } = req.body;

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

      const new_pass = await Encrypt.cryptPassword(password);

      const data: any = await mySqlPool.query(
        "insert into users (firstname,lastname,email,password,phone,address_1, address_2) values (?,?,?,?,?,?,?)",
        [firstname, lastname, email, new_pass, phone, address_1, address_2]
      );
      const insert_id = data[0].insertId;
      if (!data) {
        res.status(404).send({ success: false, message: "error on query" });
      }

      var token = jwt.sign(
        {
          id: insert_id,
        },
        process.env.API_SECRET,
        {
          expiresIn: "12 days",
        }
      );

      const user_row: any = await mySqlPool.query(
        "select * from users where id = ?",
        [insert_id]
      );
      const user = user_row[0][0];
      delete user.password;

      res.status(200).send({
        success: true,
        message: "New User Created",
        user: user,
        token: token,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ success: false, message: "unable to create user", error });
    }
  };
}

export default new AuthApiController();
