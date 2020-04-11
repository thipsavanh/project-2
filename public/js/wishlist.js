$(document).ready(function() {
    $.get("/api/user_data").then(function(data) {
        $(".member-name").text(data.username);
    });
    let wishlist = []
    $("#find-book").on("click", function(event) {
        event.preventDefault();

        // grab title name
        var intitle = $("#title").val().trim();
        console.log(intitle)
            //refactor to .env later 
        var yourAPIKey = "AIzaSyDkN88vIBWXAbfxV4WBnTEVJ8aZeh93mks";
        // Send an AJAX GET-request with jQuery TO GOOGLE BOOKS API
        var queryURL = `https://www.googleapis.com/books/v1/volumes?q=search+${intitle}+maxResults=5&${yourAPIKey}`
            //  https://www.googleapis.com/books/v1/volumes?q=${isbn}&key=${yourAPIKey} 

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response)
                // console.log(response.items[0].volumeInfo)
            console.log(response.items[0].volumeInfo.title)
            console.log(response.items[0].volumeInfo.authors)
            console.log(response.items[0].volumeInfo.description)
            console.log(response.items[0].volumeInfo.imageLinks.smallThumbnail)

            let Wish = function(title, author, image) {
                this.title = title,
                    this.author = author,
                    this.image = image

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
                    let bookobject = wishlist[myId]
                    addBook(bookobject.title, bookobject.author, bookobject.image, bookobject.isbn);
                    // wishlist[myId]
                    // console.log(wishlist[myId].title);
                    // console.log(e.target.id)
                });
                cardDiv3.append(button);
                buttonID++;
                //appends to the page 
                $(".search-results").append(cardDiv)

                var title = response.items[i].volumeInfo.title;
                var author = response.items[i].volumeInfo.authors[0];
                var image = response.items[i].volumeInfo.imageLinks.smallThumbnail;
                var newBook = new Wish(title, author, image);
                // console.log(newBook)
                wishlist.push(newBook);
                console.log(wishlist)

            }
        });
        // Emptying input box by replacing the value with an empty string
        $("#title").val("");

    });

    function addBook(title, author, image) {
        console.log(title, author, image)
        $.post("/wishlist", {
            title: title,
            author: author,
            image: image
        }).done
    }
});