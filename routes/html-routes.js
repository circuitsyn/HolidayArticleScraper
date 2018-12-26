var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Article.find({saved: false}).then(function(data) {
      // console.log(data);
      if (data === undefined || data.length == 0) {
        res.render("partials/index-empty");
        console.log('rendered blank block'); 
        console.log('html data blank: ', data);
      }
      else {
        res.render("partials/index", {
          msg: "Welcome!",
          result: data
        })
        console.log('html data index: ', data);
      }
      
      
      
  });
});

  // Load clipped items page
  app.get("/clipped", function(req, res) {
    db.Article.find({saved: true}).then(function(data) {
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