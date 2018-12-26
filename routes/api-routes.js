var db = require("../models");
// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
// var mongoose = require("mongoose");

module.exports = function(app) {

  // A GET route for scraping the echoJS website - Bobvilla
  app.get("/api/scrape/Bob", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.bobvila.com/slideshow/christmas-decorations-gone-wild-46521#big-christmas-tree").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("li.anchor").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("h2")
          .text();
        result.link = $(this)
          .children("div.content")
          .children("div.text")
          .children("p")
          .children('a')
          .attr("href");
        result.img = $(this)
          .children("div.content")
          .children("div.img")
          .children("a")
          .attr("href");

        result.description = $(this)
          .children("div.content")
          .children("div.text")
          .children("p")
          .text()
          .trim();
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });

  // A GET route for scraping the echoJS website - Hottest Decor
  app.get("/api/scrape/Hot", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.housebeautiful.com/entertaining/holidays-celebrations/g24284462/best-new-holiday-decorations-2018/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("div.listicle-slide-portrait").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("div.listicle-slide-hed")
          .children("span.listicle-slide-hed-text")
          .text();

        result.link = $(this)
          .children("div.listicle-slide-dek")
          .children("p")
          .children("a")
          .attr("href");

        result.img = $(this)
          .children("div.listicle-slide-media-outer")
          .children("div.listicle-slide-media-image")
          .children("div.slide-media-inner")
          .children("span.slide-image-wrap")
          .children("picture.zoomable")
          .children("img")
          .attr("src");

        result.description = $(this)
          .children("div.listicle-slide-dek")
          .children("p")
          .eq(2)
          .text()
          .trim();
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });
  

  //Route for changing article to unsaved
  app.put("/api/articles/unsave/:id", function(req, res) {
    console.log('id: ', req.params.id);
    db.Article.update({_id: req.params.id}, {$set: {saved: false}})
      .then(function(response) {
        console.log ('removed from saved');
        console.log ('status response: ', response)
      })
      .catch(function(err) {
        res.json(err);
    });
  });

  //Route for changing article to saved
  app.put("/api/articles/save/:id", function(req, res) {
    console.log('id: ', req.params.id);
    db.Article.update({_id: req.params.id}, {$set: {saved: true}})
      .then(function(response) {
        console.log ('saved');
      })
      .catch(function(err) {
        res.json(err);
    });
  });

  //Route to delete Article
  app.get("/api/deleteArticle/:id", function(req, res) {
    console.log('id: ', req.params.id);
    db.Article.deleteOne({_id: req.params.id})
      .then(function(response) {
        console.log ('deleted article');
      })
      .catch(function(err) {
        res.json(err);
    });
  });
  
  //Route to Delete Note
  app.get("/api/deleteNote/:id", function(req, res) {
    console.log('id: ', req.params.id);
    db.Note.deleteOne({_id: req.params.id})
      .then(function(response) {
        console.log ('deleted note');
      })
      .catch(function(err) {
        res.json(err);
    });
  });

  //Route to clear table of unsaved articles
  app.get("/api/clear", function(req, res) {
    db.Article.deleteMany({saved: false})
      .then(function(response) {
        console.log ('cleared all unsaved');
      })
      .catch(function(err) {
        res.json(err);
    });
  });
  


// ------------------------------------

  // Route for getting all Articles from the db
  app.get("api/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/api/articles/populate/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.find({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/api/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    console.log('note post response', req.body);
    db.Note.create(req.body)
      .then(function(dbNote) {
        console.log('dbnote: ', dbNote);
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: {note: dbNote._id}});
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
};