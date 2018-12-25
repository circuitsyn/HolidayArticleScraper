$(document.body).ready(function() {
//functions
//containerized populate function
var populateFunc = function(ID){
  console.log('inside pop func: ', ID)
  $.ajax({
    method: "GET",
    url: "/api/articles/populate/" + ID,  
  })
  .done(function(data) {
    $('#note-content').empty();
    console.log('note building data: ', data);
    for(i=0; i < data[0].note.length; i++){
    let notesArea = $("#note-content");
    
    let notesDiv = $("<div>");
        notesDiv.addClass("col-12 noteCont");

    let noteTitle = $("<h4>");
        noteTitle.text(data[0].note[i].title);
        noteTitle.addClass("notesAreaTitle");
        notesDiv.append(noteTitle);  
      
    let notesBody = $("<p>");
        notesBody.text(data[0].note[i].body)
        notesBody.addClass("notesAreaBody float-left");
        notesDiv.append(notesBody);

    let notesCloseBtn = $("<button>");
        notesCloseBtn.attr("type", "button");
        notesCloseBtn.attr("note-id", data[0].note[i]._id);
        notesCloseBtn.attr("data-id", data[0].note[i].relArtID);
        notesCloseBtn.addClass("btnGrp btn-sm btn-success deleteNoteBtn float-right");
        notesCloseBtn.text("X");
        // notesCloseBtn.click(deleteNoteBtn);
        notesDiv.append(notesCloseBtn);

        notesArea.append(notesDiv);
  };

});
}


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
const deleteNote = (currentID, articleID) => {
  // let id = currentID;
  // let aId = articleID;
  console.log('id info:', currentID, articleID);
  $.ajax({
    method: "GET",
    url: "/api/deleteNote/" + currentID
  }).then(function() {
      console.log('article ID entering pop func for delete note', articleID)
    populateFunc(articleID);
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
$("#note-content").on( "click", ".deleteNoteBtn", function(e) {
  e.preventDefault();
  let currentID = $(this).attr("note-id");
  let articleID = $(this).attr("data-id");
  console.log('first id set', currentID, articleID)
  deleteNote(currentID, articleID);
  console.log('Deleted note!');
  populateFunc(articleID);
  
});
//   .then(function(articleID) {  
//   
// });

//Delete Article
$('.deleteBtn').on("click", function() {
  currentID = $(this).attr("data-id");
  deleteArticle(currentID);
  console.log('Deleted article!');
  location.reload();
});

//Save Item
$('.saveBtn').on("click", function(e) {
  e.preventDefault();
  currentID = $(this).attr("data-id");
  saveArticle(currentID);
  console.log("Ive been Clicked! - save");
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
// $(document).on("click", "p", function() {
//   // Empty the notes from the note section
//   $("#notes").empty();
//   // Save the id from the p tag
//   var thisId = $(this).attr("data-id");

//   // Now make an ajax call for the Article
//   $.ajax({
//     method: "GET",
//     url: "/articles/" + thisId
//   })
//     // With that done, add the note information to the page
//     .then(function(data) {
//       console.log(data);
//       // The title of the article
//       $("#notesAreaTitle").append("<h2>" + data.title + "</h2>");
//       // An input to enter a new title
//       // $("#notes").append("<input id='titleinput' name='title' >");
//       // A textarea to add a new note body
//       $("#notesAreaBody").append("<textarea id='bodyinput' name='body'></textarea>");
//       // A button to submit a new note, with the id of the article saved to it
//       $("#notes").append("<button note-id='" + data._id + "' id='savenote'>Save Note</button>");

//       // If there's a note in the article
//       if (data.note) {
//         // Place the title of the note in the title input
//         $("#titleinput").val(data.note.title);
//         // Place the body of the note in the body textarea
//         $("#bodyinput").val(data.note.body);
//       }
//     });
// });

//Add/view Note Modal Trigger
$('.addViewNoteTrig').on("click", function(e) {
  e.preventDefault();
  let ID = $(this).attr("data-id");
  $('.saveNote').attr("data-id", ID);
  $('#note-content').empty();
  $('#noteModal').modal("show");
  
  populateFunc(ID);

});

//Save Note Modal Trigger
$('.saveNote').on("click", function(e) {
  e.preventDefault();
  let titleInput = $("#titleinput").val();
  let bodyInput = $("#bodyinput").val();
  let articleID = $('.saveNote').attr("data-id");
 

  if(titleInput || bodyInput != "") {
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/api/articles/" + articleID,
    data: {
      // Value taken from title input
      title: titleInput,
      // Value taken from note textarea
      body: bodyInput,
      // Saving article ID in note for repupulation of notes
      relArtID: articleID
    }
    
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log('note post data: ', data);

      populateFunc(articleID);
      // Empty the notes section
      // $("#notes").empty();
      $('#titleInput').val('');
      $('#bodyInput').val('');
    });
  }
else {
  $('.bd-example-modal-sm').modal("show")
}
});

});