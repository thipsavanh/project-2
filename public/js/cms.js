$(document).ready(function() {
    
    var bodyInput = $("#body");
    var titleInput = $("#title");
    var cmsForm = $("#cms");
    var userSelect = $("#user");
   
    $(cmsForm).on("submit", handleFormSubmit);
  
    var url = window.location.search;
    var postId;
    var userId;
 
    var updating = false;
  
  
    if (url.indexOf("?post_id=") !== -1) {
      postId = url.split("=")[1];
      getPostData(postId, "post");
    }

    else if (url.indexOf("?user_id=") !== -1) {
      userNameId = url.split("=")[1];
    }
  
   
    getUsers();
  
 
    function handleFormSubmit(event) {
      event.preventDefault();
      // Wont submit the post if we are missing a body, title, or author
      if (!titleInput.val().trim() || !bodyInput.val().trim() || !userSelect.val()) {
        return;
      }
      // Constructing a newPost object to hand to the database
      var newPost = {
        title: titleInput
          .val()
          .trim(),
        body: bodyInput
          .val()
          .trim(),
        UserId: userSelect.val()
      };
  
      // If we're updating a post run updatePost to update a post
      // Otherwise run submitPost to create a whole new post
      if (updating) {
        newPost.id = postId;
        updatePost(newPost);
      }
      else {
        submitPost(newPost);
      }
    }
  
    // Submits a new post and brings user to blog page upon completion
    function submitPost(post) {
      $.post("/api/posts", post, function() {
        window.location.href = "/blogpost";
      });
    }
  
    // Gets post data for the current post if we're editing, or if we're adding to an author's existing posts
    function getPostData(id, type) {
      var queryUrl;
      switch (type) {
      case "blogpost":
        queryUrl = "/api/blogpost/" + id;
        break;
      case "user":
        queryUrl = "/api/users/" + id;
        break;
      default:
        return;
      }
      $.get(queryUrl, function(data) {
        if (data) {
          console.log(data.UserNameId || data.id);
        
          titleInput.val(data.title);
          bodyInput.val(data.body);
          userNameId = data.UserNameId || data.id;
         
          updating = true;
        }
      });
    }
  
 
    function getUsers() {
      $.get("/api/users", renderUserList);
    }
   
    function renderUserList(data) {
      if (!data.length) {
        window.location.href = "/users";
      }
      $(".hidden").removeClass("hidden");
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createUserRow(data[i]));
      }
      userSelect.empty();
      console.log(rowsToAdd);
      console.log(userSelect);
      userSelect.append(rowsToAdd);
      userSelect.val(userId);
    }
  
    
    function createUserRow(user) {
      var listOption = $("<option>");
      listOption.attr("value", user.id);
      listOption.text(user.name);
      return listOption;
    }
  
    // Update a given post, bring user to the blog page when done
    function updatePost(post) {
      $.ajax({
        method: "PUT",
        url: "/api/posts",
        data: post
      })
        .then(function() {
          window.location.href = "/blogpost";
        });
    }
  });
  