const jwt = require("jsonwebtoken");
import "dotenv/config";

function verifyToken(req, res, next) {
  next();
  // const token = req.header("Authorization");
  // if (!token) return res.status(401).json({ error: "Access denied..." });
  // try {
  //   const token = req.headers.authorization.split(" ")[1];
  //   const decoded = jwt.verify(token, process.env.API_SECRET);
  //   req.userId = decoded.userId;
  //   next();
  // } catch (error) {
  //   res.status(401).json({ error: "Invalid token", e: error });
  // }
}

export default verifyToken;
