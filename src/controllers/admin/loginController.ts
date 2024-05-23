import { Encrypt } from "../../library/Encrypt";

class LoginController {
  loginForm = (req, res) => {
    res.render("login");
  };

  processLogin = (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    if (email === "admin@gmail.com" && password === "test") {
      const user = {
        id: "1",
        firstname: "Admin",
        lastname: "super",
        email: "admin@gmail.com",
      };
      req.session.user = user;
      res.redirect("/admin/home");
    } else {
      res.render("login", { msg: "Invalid Login" });
    }
  };

  test = (req, res) => {
    // res.send(req.session);
    if (req.session.page_views) {
      req.session.page_views++;
      res.send("You visited this page " + req.session.page_views + " times");
    } else {
      req.session.page_views = 1;
      res.send("Welcome to this page for the first time!");
    }
  };

  logout = (req, res) => {
    req.session.destroy(function () {
      console.log("user logged out.");
    });
    res.redirect("/auth/admin/login");
  };
}

export default new LoginController();
