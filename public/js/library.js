 //route that pulls all of the books from db
 // find all for 
 // db.Library
 //get request to grab the books 

 //created loop that displays them on the page in cards 

 $(document).ready(function() {
     // This file just does a GET request to figure out which user is logged in
     // and updates the HTML on the page
     $.get("/api/user_data").then(function(data) {
         $(".member-name").text(data.full_name);
         console.log(data)
     });


     function getBooks() {

         $.get("/api/library", function(data) {
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

             //  let Book = function(title, author, image) {
             //      this.title = title,
             //          this.author = author,
             //          this.image = image

             //  };
             //  var buttonID = 0;
             //render a new card for each book 
             for (var i = 0; i < 5; i++) {
                 var cardDiv = $("<div>").addClass("card");
                 console.log(response[0].title)
                 console.log(response[0].author)
                     //  console.log(response[0].description)
                 console.log(response[i].image)
                 var imageTag = $("<img>").attr("src", response[i].image).addClass("card-img-top").css("width:", "180px").css("height", "280px");
                 var cardDiv2 = $("<div>").addClass("card-body")
                 cardDiv.append(imageTag, cardDiv2);
                 var titleDiv = $("<h4>").addClass("card-title").text(JSON.stringify(response[i].title).replace(/['"]+/g, ''))
                 var authorDiv = $("<p>").addClass("card-text").text("Written by: " + JSON.stringify(response[i].author).replace(/['"]+/g, ''));
                 //create a link to add to bookshelf
                 cardDiv2.append(titleDiv, authorDiv, cardDiv3);
                 var cardDiv3 = $("<div>").addClass("card-body");
                 //  var button = $("<button>").addClass("card-link btn btn-warning btn-md").text("Add to Bookshelf").attr("id", buttonID);

                 //  button.on("click", function(e) {
                 //      e.preventDefault();

                 //  });
                 //  cardDiv3.append(button);
                 //   buttonID++;
                 //appends to the page 
                 $(".books").append(cardDiv)
                     //  var title = response.items[i].volumeInfo.title;
                     //  var author = response.items[i].volumeInfo.authors[0];
                     //  var image = response.items[i].volumeInfo.imageLinks.smallThumbnail;
                     //  var isbn = response.items[i].volumeInfo.industryIdentifiers[0].identifier;
                     //  var newBook = new Book(title, author, image, isbn);
                     // console.log(newBook)
                     //  library.push(newBook)
                     //  console.log(library)

             }


             for (var i = 6; i < 11; i++) {
                 var cardDiv = $("<div>").addClass("card");
                 console.log(response[0].title)
                 console.log(response[0].author)
                     //  console.log(response[0].description)
                 console.log(response[i].image)
                 var imageTag = $("<img>").attr("src", response[i].image).addClass("card-img-top").css("width:", "180px").css("height", "280px");
                 var cardDiv2 = $("<div>").addClass("card-body")
                 cardDiv.append(imageTag, cardDiv2);
                 var titleDiv = $("<h4>").addClass("card-title").text(JSON.stringify(response[i].title).replace(/['"]+/g, ''))
                 var authorDiv = $("<p>").addClass("card-text").text("Written by: " + JSON.stringify(response[i].author).replace(/['"]+/g, ''));
                 //create a link to add to bookshelf
                 cardDiv2.append(titleDiv, authorDiv, cardDiv3);
                 var cardDiv3 = $("<div>").addClass("card-body");
                 //  var button = $("<button>").addClass("card-link btn btn-warning btn-md").text("Add to Bookshelf").attr("id", buttonID);

                 // button.on("click", function(e) {
                 //     e.preventDefault();

                 // });
                 //  cardDiv3.append(button);
                 //   buttonID++;
                 //appends to the page 
                 $(".books2").append(cardDiv)
                     //  var title = response.items[i].volumeInfo.title;
                     //  var author = response.items[i].volumeInfo.authors[0];
                     //  var image = response.items[i].volumeInfo.imageLinks.smallThumbnail;
                     //  var isbn = response.items[i].volumeInfo.industryIdentifiers[0].identifier;
                     //  var newBook = new Book(title, author, image, isbn);
                     // console.log(newBook)
                     //  library.push(newBook)
                     //  console.log(library)

             }
         });
     }
     getBooks()
 });