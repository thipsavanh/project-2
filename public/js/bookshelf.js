$(document).ready(function() {
var findBook = $("#find-book");
var searchISBN = $("#isbn");

findBook.on("click", function(event) {
    event.preventDefault();

    // grab isbn number 

    var isbn = searchISBN.val().trim();
    console.log(isbn)
        // Send an AJAX GET-request with jQuery TO GOOGLE BOOKS API

    var queryURL = `https://www.googleapis.com/books/v1/volumes?q=${isbn}+isbn+maxresults=40+orderBy=relevance`
        //  https://www.googleapis.com/books/v1/volumes?q=isbn%${isbn}&key=${yourAPIKey}

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response)
        console.log(response.items[0])
        $(".search-results").text(JSON.stringify(response.items[0]));
        createCard(response)
    });
    // Emptying input box by replacing the value with an empty string
    $("#isbn").val("");

    var isbn = searchISBN.val().trim();
    console.log(isbn)
        // Send an AJAX GET-request with jQuery TO GOOGLE BOOKS API

    var queryURL = `https://www.googleapis.com/books/v1/volumes?q=${isbn}+isbn`
        //  https://www.googleapis.com/books/v1/volumes?q=isbn%${isbn}&key=${yourAPIKey}

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response)
        console.log(response.items[0])
        $(".search-results").text(JSON.stringify(response.items[0]));
        createCard(response)
    });
    // Emptying input box by replacing the value with an empty string
    $("#isbn").val("");
});

var createCard = function(data) {
    // Create a new table row element
    var div = $("<div>");
    // Methods run on jQuery selectors return the selector they we run on
    // This is why we can create and save a reference to a td in the same statement we update its text
    var titleDiv = $("<div>").text(data[0].volumeInfo.title);
    var authorDiv = $("<div>").text(data[0].volumeInfo.authors);
    var desDiv = $("<div>").text(data[0].volumeInfo.description);
    var imageDiv = $("<div>").text(data[0].volumeInfo.imageLinks.smallThumbnail);
    // Append the newly created table data to the table row
    div.append(titleDiv, authorDiv, desDiv, imageDiv);
    // Append the table row to the table body
    $("card-title").append(div);
};
});
  