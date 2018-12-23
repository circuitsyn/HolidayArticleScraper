var db = require("../models");

module.exports = function(router) {
  // Load index page
  router.get("/", function(req, res) {
    db.Article.find({}).then(function(data) {
      console.log(data);
      res.render("partials/index", {
        msg: "Welcome!",
        result: data
      });
    });
  });

  // Load clipped items page
  router.get("/clipped", function(req, res) {
    db.Article.find({saved: true}).then(function(data) {
      res.render("partials/clipped", {
        msg: "You've got clips!",
        result: data
      });
    });
  });
  
  // Render 404 page for any unmatched routes
  router.get("*", function(req, res) {
    res.render("partials/404");
  });

};