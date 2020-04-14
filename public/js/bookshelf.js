$(document).ready(function() {
    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page
    $.get("/api/user_data").then(function(data) {
        $(".member-name").text(data.full_name);
        console.log(data)
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
            console.log(response.items[0].volumeInfo.canonicalVolumeLink)
            let Book = function(title, author, image, isbn) {
                this.title = title,
                    this.author = author,
                    this.image = image,
                    this.isbn = isbn

            };
            var buttonID = 0;
            //render a new card for each book 
            for (var i = 0; i < 3; i++) {

                // <div class="card-group">
                // <div class="card">
                //   <img class="card-img-top" src="..." alt="Card image cap">
                //   <div class="card-body">
                //     <h5 class="card-title">Card title</h5>
                //     <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                //     <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
                //   </div>
                // </div>
                // var cardGroup = $("<div>").addClass("card-group")
                // cardGroup.append(cardDiv)
                var cardDiv = $("<div>").addClass("card")
                    // .css("width", "18rem")
                    // var cardDiv = $("<div>").addClass("card-body")
                    // var divStyle = $("<div>").addClass("card")
                    // cardDiv.append(divStyle);
                var imageTag = $("<img>").attr("src", response.items[i].volumeInfo.imageLinks.smallThumbnail).addClass("card-img-top").css("width:", "180px").css("height", "280px");
                var cardDiv2 = $("<div>").addClass("card-body")
                cardDiv.append(imageTag, cardDiv2);
                var titleDiv = $("<h4>").addClass("card-title").text(JSON.stringify(response.items[i].volumeInfo.title).replace(/['"]+/g, ''))
                var viewDiv = $('<a>').text("Preview more details here.").attr("href", response.items[i].volumeInfo.canonicalVolumeLink)
                var desDiv = $("<p>").addClass("card-text").text(JSON.stringify(response.items[i].volumeInfo.description).replace(/['"]+/g, ''))
                var isbnDiv = $("<p>").addClass("card-text").text("ISBN: " + JSON.stringify(response.items[i].volumeInfo.industryIdentifiers[0].identifier).replace(/['"]+/g, ''))
                var authorDiv = $("<p>").addClass("card-text").text("Written by: " + JSON.stringify(response.items[i].volumeInfo.authors[0]).replace(/['"]+/g, ''));
                //create a link to add to bookshelf
                var cardDiv3 = $("<div>").addClass("card-body");
                cardDiv2.append(titleDiv, authorDiv, desDiv, isbnDiv, viewDiv, cardDiv3);


                var button = $("<button>").addClass("card-link btn btn-warning btn-md").text("Add to Bookshelf").attr("id", buttonID);

                button.on("click", function(e) {
                    e.preventDefault();
                    var myId = e.target.id
                    let bookobject = library[myId]
                    clearPage()
                    addBook(bookobject.title, bookobject.author, bookobject.image, bookobject.isbn);
                    // library[myId]
                    // console.log(library[myId].title);
                    // console.log(e.target.id)
                })

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
            for (var i = 4; i < 7; i++) {

                // <div class="card-group">
                // <div class="card">
                //   <img class="card-img-top" src="..." alt="Card image cap">
                //   <div class="card-body">
                //     <h5 class="card-title">Card title</h5>
                //     <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                //     <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
                //   </div>
                // </div>
                // var cardGroup = $("<div>").addClass("card-group")
                // cardGroup.append(cardDiv)
                var cardDiv = $("<div>").addClass("card")
                    // .css("width", "18rem")
                    // var cardDiv = $("<div>").addClass("card-body")
                    // var divStyle = $("<div>").addClass("card")
                    // cardDiv.append(divStyle);
                var imageTag = $("<img>").attr("src", response.items[i].volumeInfo.imageLinks.smallThumbnail).addClass("card-img-top").css("width:", "180px").css("height", "280px");
                var cardDiv2 = $("<div>").addClass("card-body")
                cardDiv.append(imageTag, cardDiv2);
                var titleDiv = $("<h4>").addClass("card-title").text(JSON.stringify(response.items[i].volumeInfo.title).replace(/['"]+/g, ''))
                var viewDiv = $('<a>').text("Preview more details here.").attr("href", response.items[i].volumeInfo.canonicalVolumeLink)
                var desDiv = $("<p>").addClass("card-text").text(JSON.stringify(response.items[i].volumeInfo.description).replace(/['"]+/g, ''))
                var isbnDiv = $("<p>").addClass("card-text").text("ISBN: " + JSON.stringify(response.items[i].volumeInfo.industryIdentifiers[0].identifier).replace(/['"]+/g, ''))
                var authorDiv = $("<p>").addClass("card-text").text("Written by: " + JSON.stringify(response.items[i].volumeInfo.authors[0]).replace(/['"]+/g, ''));
                //create a link to add to bookshelf
                var cardDiv3 = $("<div>").addClass("card-body");
                cardDiv2.append(titleDiv, authorDiv, desDiv, isbnDiv, viewDiv, cardDiv3);


                var button = $("<button>").addClass("card-link btn btn-warning btn-md").text("Add to Bookshelf").attr("id", buttonID);

                button.on("click", function(e) {
                    e.preventDefault();
                    var myId = e.target.id
                    let bookobject = library[myId]
                    clearPage()
                    addBook(bookobject.title, bookobject.author, bookobject.image, bookobject.isbn);
                    // library[myId]
                    // console.log(library[myId].title);
                    // console.log(e.target.id)
                })

                cardDiv3.append(button);

                buttonID++;
                //appends to the page 
                $(".search-results2").append(cardDiv)
                var title = response.items[i].volumeInfo.title;
                var author = response.items[i].volumeInfo.authors[0];
                var image = response.items[i].volumeInfo.imageLinks.smallThumbnail;
                var isbn = response.items[i].volumeInfo.industryIdentifiers[0].identifier;
                var newBook = new Book(title, author, image, isbn);
                // console.log(newBook)
                library.push(newBook)
                console.log(library)

            }
        }).catch(handleLoginErr);
        // Emptying input box by replacing the value with an empty string
        $("#title").val("");
        clearCard();

        function clearCard() {
            // $(".search-results").remove()
        }
    });


    function clearPage() {
        window.location.href = "/bookshelf";
    }

    function getID() {
        $.get("/api/user_data").then(function(data) {
            let id = data.id
                // console.log(id)
            return id
        });
    }

    function addBook(title, author, image, isbn) {
        getID()
        console.log(title, author, image, isbn)
        $.post("/bookshelf", {
            title: title,
            author: author,
            image: image,
            isbn: isbn,
            isbn: isbn
        }).done
    }

    function handleLoginErr(err) {
        $("#alert .msg").text(err.responseJSON);
        $("#alert").fadeIn(500);
    }
});