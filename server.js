var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");

// Initialize Express
var app = express();
var router = express.Router();

// Configure middleware
app.use(router);
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

var PORT = 3000 || process.env.PORT;

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");


// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true }, function(error) {
  //log any errors
  if (error) {
    console.log(error);
  }
  // or log success
  else {
    console.log("mongoose connection is successful");
  }
});



// Routes
require("./routes/api-routes")(app);
require("./routes/html-routes")(app);


// Start the server
app.listen(PORT, function() {
  console.log("App running - go catch it!");
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
