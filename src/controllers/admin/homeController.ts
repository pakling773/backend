class HomeController {
  index(req, res) {
    res.render("index");
  }
}

export default new HomeController();
