$(document).ready(function() {
    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page
    $.get("/api/user_data").then(function(data) {
        $(".member-name").text(data.username);
    });

    let library = []
    $("#find-book").on("click", function(event) {
        event.preventDefault();

        // grab title name
        var intitle = $("#title").val().trim();
        console.log(intitle)



        $.ajax({
            url: `/getbooks/${intitle}`,
            method: "GET"
        }).then(function(response) {
            console.log(response)
                // console.log(response.items[0].volumeInfo)
            console.log(response.items[0].volumeInfo.title)
            console.log(response.items[0].volumeInfo.authors)
            console.log(response.items[0].volumeInfo.description)
            console.log(response.items[0].volumeInfo.imageLinks.smallThumbnail)

            let Book = function(title, author, image, isbn) {
                this.title = title,
                    this.author = author,
                    this.image = image,
                    this.isbn = isbn

            };
            var buttonID = 0;
            //render a new card for each book 
            for (var i = 0; i < 5; i++) {
                var cardDiv = $("<div>").addClass("card-body")
                var divStyle = $("<div>").addClass("card")
                cardDiv.append(divStyle);
                var imageTag = $("<img>").attr("src", response.items[i].volumeInfo.imageLinks.smallThumbnail).addClass("card-img-top");
                var cardDiv2 = $("<div>").addClass("card-body")
                divStyle.append(imageTag, cardDiv2);
                var titleDiv = $("<h5>").addClass("card-title").text(JSON.stringify(response.items[i].volumeInfo.title))
                var desDiv = $("<p>").addClass("card-text").text(JSON.stringify(response.items[i].volumeInfo.description))
                var isbnDiv = $("<p>").addClass("card-text").text(JSON.stringify(response.items[i].volumeInfo.industryIdentifiers[0].identifier))
                var authorDiv = $("<p>").addClass("card-text").text(JSON.stringify(response.items[i].volumeInfo.authors[0]));
                //create a link to add to bookshelf
                var cardDiv3 = $("<div>").addClass("card-body");
                cardDiv2.append(titleDiv, desDiv, isbnDiv, authorDiv, cardDiv3);
                var button = $("<button>").addClass("card-link").text("Add to Bookshelf").attr("id", buttonID);

                button.on("click", function(e) {
                    e.preventDefault();
                    var myId = e.target.id
                    let bookobject = library[myId]
                    addBook(bookobject.title, bookobject.author, bookobject.image, bookobject.isbn);
                    // library[myId]
                    // console.log(library[myId].title);
                    // console.log(e.target.id)
                });
                cardDiv3.append(button);
                buttonID++;
                //appends to the page 
                $(".search-results").append(cardDiv)
                var title = response.items[i].volumeInfo.title;
                var author = response.items[i].volumeInfo.authors[0];
                var image = response.items[i].volumeInfo.imageLinks.smallThumbnail;
                var isbn = response.items[i].volumeInfo.industryIdentifiers[0].identifier;
                var newBook = new Book(title, author, image, isbn);
                // console.log(newBook)
                library.push(newBook)
                console.log(library)

            }
        });
        // Emptying input box by replacing the value with an empty string
        $("#title").val("");

    });

    function addBook(title, author, image, isbn) {
        console.log(title, author, image, isbn)
        $.post("/bookshelf", {
            title: title,
            author: author,
            image: image,
            isbn: isbn
        }).done
    }
});


google.books.load();

var viewerCanvas = $("#viewerCanvas")

function initialize() {
    var viewer = new google.books.DefaultViewer(document.getElementById('viewerCanvas'));
    viewer.load('ISBN:0738531367');
}

google.books.setOnLoadCallback(initialize);