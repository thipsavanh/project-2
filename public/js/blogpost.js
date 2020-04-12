// Using IIFE for Implementing Module Pattern to keep the Local Space for the JS Variables
(function() {
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    var serverUrl = "/blogpost",
        comments = [],
        pusher = new Pusher('85a6ad4dfa25e855b', {
          cluster: 'us2',
          encrypted: true
        }),
        // Subscribing to the 'flash-comments' Channel
        channel = pusher.subscribe('flash-comments'),
        commentForm = document.getElementById('comment-form'),
        commentsList = document.getElementById('comments-list'),
        commentTemplate = document.getElementById('comment-template');

    // Binding to Pusher Event on our 'flash-comments' Channel
    channel.bind('new_comment',newCommentReceived);

    // Adding to Comment Form Submit Event
    commentForm.addEventListener("submit", addNewComment);

    // New Comment Receive Event Handler
    // We will take the Comment Template, replace placeholders & append to commentsList
    function newCommentReceived(data){
      var newCommentHtml = commentTemplate.innerHTML.replace('{{userName}}',data.userName);
      newCommentHtml = newCommentHtml.replace('{{comment}}',data.comment);
      var newCommentNode = document.createElement('div');
      newCommentNode.classList.add('comment');
      newCommentNode.innerHTML = newCommentHtml;
      commentsList.appendChild(newCommentNode);
    }

    var newCommentUser = $("#new_comment_userName");
    var comment = $("#new_comment_text");

    function addNewComment(event){
      console.log("hi");
      event.preventDefault();
      var newComment = {
        user: newCommentUser.val(),
        comment: comment.val()
      }

      var xhr = new XMLHttpRequest();
      xhr.open("POST", serverUrl+"comment", true);
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.onreadystatechange = function () {
        if (xhr.readyState != 4 || xhr.status != 200) return;

        // On Success of creating a new Comment
        console.log("Success: " + xhr.responseText);
        commentForm.reset();
      };
      xhr.send(JSON.stringify(newComment));
    }

})();