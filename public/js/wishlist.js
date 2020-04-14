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
        $.get("/api/user_data").then(function(data) {
            $.ajax({
                url: `/getbooks/${intitle}`,
                method: "GET"
            }).then(function(response, data) {
                    console.log(response)
                    console.log(data) // console.log(response.items[0].volumeInfo)

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
                    for (var i = 0; i < 4; i++) {
                        var cardDiv = $("<div>").addClass("card")
                            // .css("width", "18rem")
                            // var cardDiv = $("<div>").addClass("card-body")
                            // var divStyle = $("<div>").addClass("card")
                            // cardDiv.append(divStyle);
                        var imageTag = $("<img>").attr("src", response.items[i].volumeInfo.imageLinks.smallThumbnail).addClass("card-img-top");
                        var cardDiv2 = $("<div>").addClass("card-body")
                        cardDiv.append(imageTag, cardDiv2);
                        var titleDiv = $("<h4>").addClass("card-title").text(JSON.stringify(response.items[i].volumeInfo.title).replace(/['"]+/g, ''))
                        var desDiv = $("<p>").addClass("card-text").text(JSON.stringify(response.items[i].volumeInfo.description).replace(/['"]+/g, ''))
                        var isbnDiv = $("<p>").addClass("card-text").text("ISBN: " + JSON.stringify(response.items[i].volumeInfo.industryIdentifiers[0].identifier).replace(/['"]+/g, ''))
                        var authorDiv = $("<p>").addClass("card-text").text("Written by: " + JSON.stringify(response.items[i].volumeInfo.authors[0]).replace(/['"]+/g, ''));
                        //create a link to add to bookshelf
                        var cardDiv3 = $("<div>").addClass("card-body");
                        cardDiv2.append(titleDiv, authorDiv, desDiv, isbnDiv, cardDiv3);
                        var button = $("<button>").addClass("card-link btn btn-warning btn-md").text("Add to Wishlist").attr("id", buttonID);
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
                    }
                    for (var j = 5; j < 7; j++) {
                        var cardDiv1 = $("<div>").addClass("card")
                            // .css("width", "18rem")
                            // var cardDiv = $("<div>").addClass("card-body")
                            // var divStyle = $("<div>").addClass("card")
                            // cardDiv.append(divStyle);
                        var imageTag = $("<img>").attr("src", response.items[j].volumeInfo.imageLinks.smallThumbnail).addClass("card-img-top");
                        var cardDiv2 = $("<div>").addClass("card-body")
                        cardDiv1.append(imageTag, cardDiv2);
                        var titleDiv = $("<h4>").addClass("card-title").text(JSON.stringify(response.items[j].volumeInfo.title).replace(/['"]+/g, ''))
                        var desDiv = $("<p>").addClass("card-text").text(JSON.stringify(response.items[j].volumeInfo.description).replace(/['"]+/g, ''))
                        var isbnDiv = $("<p>").addClass("card-text").text("ISBN: " + JSON.stringify(response.items[j].volumeInfo.industryIdentifiers[0].identifier).replace(/['"]+/g, ''))
                        var authorDiv = $("<p>").addClass("card-text").text("Written by: " + JSON.stringify(response.items[j].volumeInfo.authors[0]).replace(/['"]+/g, ''));
                        //create a link to add to bookshelf
                        var cardDiv3 = $("<div>").addClass("card-body");
                        cardDiv2.append(titleDiv, authorDiv, desDiv, isbnDiv, cardDiv3);
                        var button = $("<button>").addClass("card-link btn btn-warning btn-md").text("Add to Wishlist").attr("id", buttonID);
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
                        $(".search-results2").append(cardDiv1)
                        var title = response.items[i].volumeInfo.title;
                        var author = response.items[i].volumeInfo.authors[0];
                        var image = response.items[i].volumeInfo.imageLinks.smallThumbnail;
                        var isbn = response.items[i].volumeInfo.industryIdentifiers[0].identifier;
                        var newBook = new Book(title, author, image, isbn);
                        // console.log(newBook)
                        library.push(newBook)
                        console.log(library)

                    }
                    // Emptying input box by replacing the value with an empty string
                    $("#title").val("");
                }

            );


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


    //route that pulls all of the books from db
    // find all for 
    // db.Library
    //get request to grab the books 

    //created loop that displays them on the page in cards

    function getBooks() {

        $.get("/api/wishlist", function(data) {
            console.log("books", data);
            books = data;
            // if (!books || !books.length) {
            //     displayEmpty();
            // } else {
            //     initializeRows();
            // }
        })

        .then(function(response) {
            console.log(response)
                // console.log(response.items[0].volumeInfo)
            console.log(response[0].title)
            console.log(response[0].author)
                //  console.log(response[0].description)
            console.log(response[0].image)


            //render a new card for each book 
            for (var i = 0; i < 5; i++) {
                var cardDiv = $("<div>").addClass("card");
                console.log(response[0].title)
                console.log(response[0].author)
                    //  console.log(response[0].description)
                console.log(response[i].image)
                var imageTag = $("<img>").attr("src", response[i].image).addClass("card-img-top");
                var cardDiv2 = $("<div>").addClass("card-body")
                cardDiv.append(imageTag, cardDiv2);
                var titleDiv = $("<h4>").addClass("card-title").text(JSON.stringify(response[i].title).replace(/['"]+/g, ''))
                var authorDiv = $("<p>").addClass("card-text").text("Written by: " + JSON.stringify(response[i].author).replace(/['"]+/g, ''));
                //create a link to add to bookshelf
                cardDiv2.append(titleDiv, authorDiv);
                //  buttonID++;
                //appends to the page 
                $(".books").append(cardDiv)
            }
            for (var i = 5; i < 10; i++) {
                var cardDiv = $("<div>").addClass("card");
                console.log(response[0].title)
                console.log(response[0].author)
                    //  console.log(response[0].description)
                console.log(response[i].image)
                var imageTag = $("<img>").attr("src", response[i].image).addClass("card-img-top");
                var cardDiv2 = $("<div>").addClass("card-body")
                cardDiv.append(imageTag, cardDiv2);
                var titleDiv = $("<h4>").addClass("card-title").text(JSON.stringify(response[i].title).replace(/['"]+/g, ''))
                var authorDiv = $("<p>").addClass("card-text").text("Written by: " + JSON.stringify(response[i].author).replace(/['"]+/g, ''));
                //create a link to add to bookshelf
                cardDiv2.append(titleDiv, authorDiv);
                $(".books1").append(cardDiv)

            }
        });
    }
    getBooks()

});