var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    // db.MedSightData.findAll({}).then(function(dbMedsightdata) {
      res.render("partials/index", {
        msg: "Welcome!",
      });
    // });
  });

  // Load clipped items page
  app.get("/clipped", function(req, res) {
    // db.MedSightData.findAll({}).then(function(dbMedsightdata) {
      res.render("partials/clipped", {
      });
    // });
  });
  
  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("partials/404");
  });

};