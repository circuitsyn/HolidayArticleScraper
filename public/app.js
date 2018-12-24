$(document.body).ready(function() {
//functions
//unsave item function
const unsaveArticle = (currentID) => {
  event.preventDefault();
  let id = currentID;
  $.ajax({
    method: "PUT",
    url: "/api/articles/unsave/" + id
  }).then(function() {
    $("#unsavedModal").modal("toggle");
  });
}

//save article function
const saveArticle = (currentID) => {
  event.preventDefault();
  let id = currentID;
  $.ajax({
    method: "PUT",
    url: "/api/articles/save/" + id
  }).then(function() {
    $("#savedModal").modal("toggle");
  });
}

//Delete article function
const deleteArticle = (currentID) => {
  event.preventDefault();
  let id = currentID;
  $.ajax({
    method: "GET",
    url: "/api/deleteArticle/" + id
  }).then(function() {
    $("#deleteModal").modal("toggle");
  });
}

//Delete note function
const deleteNote = (currentID) => {
  event.preventDefault();
  let id = currentID;
  $.ajax({
    method: "GET",
    url: "/api/deleteNote/" + id
  }).then(function() {
    console.log('delete note call made')
  });
}

//Scrape Bob Villa article function
const scrapeVilla = () => {
  event.preventDefault();
  $.ajax({
    method: "GET",
    url: "/api/scrape/Bob"
  }).then(function() {
    location.reload();
  });
}

//clear articles function
const clearArticles = () => {
  event.preventDefault();
  $.ajax({
    method: "GET",
    url: "/api/clear"
  }).then(function() {
    location.reload();
  });
};

//Delete Note
$('.deleteNoteBtn').on("click", function() {
  currentID = $(this).attr("data-id");
  deleteNote(currentID);
  console.log('Deleted article!');
  location.reload();
})

//Delete Article
$('.deleteBtn').on("click", function() {
  currentID = $(this).attr("data-id");
  deleteArticle(currentID);
  console.log('Deleted article!');
  location.reload();
});

//Save Item
$('.saveBtn').on("click", function() {
  currentID = $(this).attr("data-id");
  saveArticle(currentID);
  console.log("Ive been Clicked! - unsave");
  location.reload();
});

//unsave Item
$('.unsaveBtn').on("click", function() {
  currentID = $(this).attr("data-id");
  unsaveArticle(currentID);
  console.log("Ive been Clicked! - unsave");
  location.reload();
});

//scrape function
$('#bobVillaScrape').on("click", function() {
  scrapeVilla();
});

//Clear Items
$('#clear').on("click", function() {
  clearArticles();
})

// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

//Add Note Modal Trigger
$('.addNoteTrig').on("click", function(e) {
  e.preventDefault();
  var ID = $(this).attr("data-id");
  $('.saveNote').attr("data-id", ID);
  $('#noteModal').modal("show");
  
});

//Save Note Modal Trigger
$('.saveNote').on("click", function(e) {
  e.preventDefault();
  $('#noteModal').modal("hide")

  var thisId = $(this).attr("data-id");

  console.log('title: ', $("#titleinput").val())
  console.log('body: ', $("#bodyinput").val())
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/api/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
    
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log('note post data: ', data);
      // Empty the notes section
      // $("#notes").empty();
    });

});

});