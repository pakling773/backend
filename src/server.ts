import express from "express";
import path from "path";
var session = require("express-session");
var LokiStore = require("connect-loki")(session);

var cors = require("cors");
import verifyToken from "./middleware/authMiddleware";
import verifySession from "./middleware/adminAuthMiddleware";
const app = express();
const port = process.env.PORT;
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",

  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.locals.port = process.env.PORT;
app.locals.base_url = process.env.BASE_URL;
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.locals.basedir = path.join(__dirname, "views");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "../uploads")));

app.use(express.json());

var options = { autosave: true, logErrors: true };
app.use(
  session({
    store: new LokiStore(options),
    secret: "keyboard cat",
  })
);
//routes
const api_routes = require("./routes/index");
const admin_routes = require("./routes/adminRoutes");
const auth_routes = require("./routes/authRoutes");
app.use("/api", verifyToken, api_routes);
app.use("/admin", verifySession, admin_routes);
app.use("/auth", auth_routes);
import mySqlPool from "./config/mysql";
//check database connection
mySqlPool
  .query("select 1")
  .then(() => {
    //cyan
  })
  .catch(() => {
    console.log("\x1b[41m", "Database Not Connected, Server Exit");
    process.exit();
  });
app.listen(port, () => {
  return console.log(
    "\x1b[32m",
    `Express is listening at http://localhost:${port}`
  ); //cyan
});
