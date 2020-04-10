$(document).ready(function() {


    $("#find-book").on("click", function(event) {
        event.preventDefault();

        // grab title name
        var intitle = $("#title").val().trim();
        console.log(intitle)
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

            //render a new card for each book 


            for (var i = 0; i < 5; i++) {
                var cardDiv = $("<div>").addClass("card-body")
                var divStyle = $("<div>").addClass("card")
                cardDiv.append(divStyle);
                var image = $("<img>").attr("src", response.items[i].volumeInfo.imageLinks.smallThumbnail).addClass("card-img-top");
                var cardDiv2 = $("<div>").addClass("card-body")
                divStyle.append(image, cardDiv2);
                var title = $("<h5>").addClass("card-title").text(JSON.stringify(response.items[i].volumeInfo.title))
                var desDiv = $("<p>").addClass("card-text").text(JSON.stringify(response.items[i].volumeInfo.description))
                var authorDiv = $("<p>").addClass("card-text").text(JSON.stringify(response.items[i].volumeInfo.authors[0]));
                //create a link to add to bookshelf
                var cardDiv3 = $("<div>").addClass("card-body");
                cardDiv2.append(title, desDiv, authorDiv, cardDiv3);
                var button = $("<a>").addClass("card-link").text("Add to Bookshelf");
                cardDiv3.append(button);
                //appends to the page 
                $(".search-results").append(cardDiv)

            }
        });
        // Emptying input box by replacing the value with an empty string
        $("#title").val("");
    });

});