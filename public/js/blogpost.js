$(document).ready(function() {
    /* global moment */

    // blogContainer holds all of our posts
    var blogContainer = $(".blog-container");
    var postCategorySelect = $("#category");
    // Click events for the edit and delete buttons
    $(document).on("click", "button.delete", handlePostDelete);
    $(document).on("click", "button.edit", handlePostEdit);
    // Variable to hold our posts
    var posts;

    // The code below handles the case where we want to get blog posts for a specific user
    // Looks for a query param in the url for user_id
    var url = window.location.search;
    var userId;
    if (url.indexOf("?user_id=") !== -1) {
        userId = url.split("=")[1];
        getPosts(userId);
    }
    // If there's no userId we just get all posts as usual
    else {
        getPosts();
    }


    // This function grabs posts from the database and updates the view
    function getPosts(user) {
        userId = user || "";
        if (userId) {
            userId = "/?user_id=" + userId;
        }
        $.get("/api/posts" + userId, function(data) {
            console.log("Posts", data);
            posts = data;
            if (!posts || !posts.length) {
                displayEmpty(user);
            } else {
                initializeRows();
            }
        });
    }

    function getComments(user) {
        userId = user || "";
        if (userId) {
            userId = "/?user_id=" + userId;
        }
        $.get("/api/posts" + userId, function(data) {
            console.log("Posts", data);
            posts = data;
            if (!posts || !posts.length) {
                displayEmpty(user);
            } else {
                initializeRows();
            }
        });
    }


    // This function does an API call to delete posts
    function deletePost(id) {
        $.ajax({
                method: "DELETE",
                url: "/api/posts/" + id
            })
            .then(function() {
                getPosts(postCategorySelect.val());
            });
    }

    // InitializeRows handles appending all of our constructed post HTML inside blogContainer
    function initializeRows() {
        blogContainer.empty();
        var postsToAdd = [];
        for (var i = 0; i < posts.length; i++) {
            postsToAdd.push(createNewRow(posts[i]));
        }
        blogContainer.append(postsToAdd);
    }

    // This function constructs a post's HTML
    function createNewRow(post) {
        console.log(post.id);


        var formattedDate = new Date(post.createdAt);
        formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
        var newPostCard = $("<div>");
        newPostCard.addClass("card");
        var newPostCardHeading = $("<div>");
        newPostCardHeading.addClass("card-header");
        // var deleteBtn = $("<button>");
        // deleteBtn.text("x");
        // deleteBtn.addClass("delete btn btn-danger");
        // var editBtn = $("<button>");
        // editBtn.text("EDIT");
        // editBtn.addClass("edit btn btn-info");
        var newPostTitle = $("<h2>");
        var newPostDate = $("<small>");
        var newPostuser = $("<h5>");
        console.log(post.User);
        newPostuser.text("Written by: " + post.User.username);
        newPostuser.css({
            float: "right",
            color: "blue",
            "margin-top": "-10px"
        });
        var newPostCardBody = $("<div>");
        newPostCardBody.addClass("card-body");
        var newPostBody = $("<p>");
        newPostTitle.text(post.title + " ");
        newPostBody.text(post.body);
        newPostDate.text(formattedDate);
        newPostTitle.append(newPostDate);
        // newPostCardHeading.append(deleteBtn);
        // newPostCardHeading.append(editBtn);
        newPostCardHeading.append(newPostTitle);
        newPostCardHeading.append(newPostuser);
        newPostCardBody.append(newPostBody);
        newPostCard.append(newPostCardHeading);
        newPostCard.append(newPostCardBody);
        newPostCard.data("post", post);
        return newPostCard;
    }

    // This function figures out which post we want to delete and then calls deletePost
    function handlePostDelete() {
        var currentPost = $(this)
            .parent()
            .parent()
            .data("post");
        deletePost(currentPost.id);
    }

    // This function figures out which post we want to edit and takes it to the appropriate url
    function handlePostEdit() {
        var currentPost = $(this)
            .parent()
            .parent()
            .data("post");
        window.location.href = "/cms?post_id=" + currentPost.id;
    }

    // This function displays a message when there are no posts
    function displayEmpty(id) {
        var query = window.location.search;
        var partial = "";
        if (id) {
            partial = " for user #" + id;
        }
        blogContainer.empty();
        var messageH2 = $("<h2>");
        messageH2.css({ "text-align": "center", "margin-top": "50px" });
        messageH2.html("No posts yet" + partial + ", navigate <a href='/cms" + query +
            "'>here</a> in order to get started.");
        blogContainer.append(messageH2);
    }



    // Using IIFE for Implementing Module Pattern to keep the Local Space for the JS Variables
    function pusher() {
        // Enable pusher logging - don't include this in production
        Pusher.logToConsole = true;

        var serverUrl = "/blogpost",
            comments = [],
            pusher = new Pusher('85a6ad4dfa25e855b', {
                cluster: 'us2',
                encrypted: true
            }),
            // Subscribing to the 'flash-comments' Channel

            privateChannel = pusher.subscribe('flash-comments'),
            commentForm = document.getElementById('comment-form'),
            commentsList = document.getElementById('comments-list'),
            commentTemplate = document.getElementById('comment-template');

        // Binding to Pusher Event on our 'flash-comments' Channel
        privateChannel.bind('new_comment', newCommentReceived);

        // Adding to Comment Form Submit Event
        commentForm.addEventListener("submit", addNewComment);

        // New Comment Receive Event Handler
        // We will take the Comment Template, replace placeholders & append to commentsList
        function newCommentReceived(data) {
            var newCommentHtml = commentTemplate.innerHTML.replace('{{userName}}', data.user);
            newCommentHtml = newCommentHtml.replace('{{comment}}', data.comment);
            var newCommentNode = document.createElement('div');
            newCommentNode.classList.add('comment');
            newCommentNode.innerHTML = newCommentHtml;
            commentsList.appendChild(newCommentNode);
        }

        var newCommentUser = $("#new_comment_userName");
        var comment = $("#new_comment_text");

        function addNewComment(event) {
            console.log("hi");
            event.preventDefault();
            var newComment = {
                user: newCommentUser.val(),
                comment: comment.val()
            }
            comments.push(newComment);

            var xhr = new XMLHttpRequest();
            xhr.open("POST", serverUrl + "comment", true);
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.onreadystatechange = function() {
                if (xhr.readyState != 4 || xhr.status != 200) return;

                // On Success of creating a new Comment
                console.log("Success: " + xhr.responseText);
                commentForm.reset();
            };
            xhr.send(JSON.stringify(newComment));
            insertComment(newComment.user, newComment.comment);
            newCommentReceived(newComment)
        }

        function insertComment(user, comment) {
            $.post("/api/comments", { user: user, comment: comment })
                .then(function(data) {
                    // console.log(err)
                    //based on the data that I get back, if success run this and if not send an error message
                    window.location.reload()
                        //If there's an error, handle it by throwing up a bootstrap alert
                })
                .catch(handleLoginErr);
            // redirect();
        };

        function handleLoginErr(err) {
            console.log(err)
            $("#alert .msg").text(err.responseJSON);
            $("#alert").fadeIn(500);
        };

    }

    pusher();

});