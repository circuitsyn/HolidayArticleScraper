var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.MedSightData.findAll({}).then(function(data) {
      res.render("partials/index", {
        msg: "Welcome!",
        result: data
      });
    });
  });

  // Load clipped items page
  app.get("/clipped", function(req, res) {
    db.MedSightData.findAll({}).then(function(dbMedsightdata) {
      res.render("partials/clipped", {
        msg: "You've got clips!",
        result: data
      });
    });
  });
  
  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("partials/404");
  });

};