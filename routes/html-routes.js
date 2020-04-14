// Requiring path to so we can use relative routes to our HTML files
var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {

    app.get("/subscription", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/subscription.html"));
    });

    app.get("/user", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/user.html"));
    });

    app.get("/cms", function(req, res) {
        console.log("hey");
        // if (req.user) {
        //     res.redirect("/login");
        // }
        res.sendFile(path.join(__dirname, "../public/cms.html"));
    });


    // Here we've add our isAuthenticated middleware to this route.
    // If a user who is not logged in tries to access this route they will be redirected to the signup page
    // app.get("/members", isAuthenticated, function(req, res) {
    //   res.sendFile(path.join(__dirname, "../public/members.html"));
    // });

    app.get("/signup", function(req, res) {
        if (req.user) {
            res.redirect("/signup");
        }
        res.sendFile(path.join(__dirname, "../public/signup.html"));
    });

    app.get("/subscription", function(req, res) {
        if (req.user) {
            res.redirect("/subscription");
        }
        res.sendFile(path.join(__dirname, "../public/subscription.html"));
    });




    app.get("/blog", function(req, res) {
        console.log("hi");
        // if(req.user) {
        //   res.redirect("/signup");
        // }
        res.sendFile(path.join(__dirname, "../public/blogpost.html"));
    });

    app.get("/", function(req, res) {
        // If the user already has an account send them to the members page
        if (req.user) {
            res.redirect("/members");
        }
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    app.get("/signup", function(req, res) {
        // If the user already has an account send them to the members page
        res.sendFile(path.join(__dirname, "../public/signup.html"));
    });

    app.get("/bookshelf", function(req, res) {
        // If the user already has an account send them to the members page

        res.sendFile(path.join(__dirname, "../public/bookshelf.html"));
    });

    app.get("/wishlist", function(req, res) {
        // If the user already has an account send them to the members page

        res.sendFile(path.join(__dirname, "../public/wishlist.html"));
    });
    app.get("/library", function(req, res) {
        // If the user already has an account send them to the members page
        res.sendFile(path.join(__dirname, "../public/library.html"));
    });
    app.get("/login", function(req, res) {
        // If the user already has an account send them to the members page
        if (req.user) {
            res.redirect("/members");
        }
        res.sendFile(path.join(__dirname, "../public/login.html"));
    });
    app.get("/blogpost", function(req, res) {
        console.log("hello");
        // If the user already has an account send them to the members page
        if (req.user) {
            res.redirect("/members");
        }
        res.sendFile(path.join(__dirname, "../public/blogpost.html"));
    });
    // Here we've add our isAuthenticated middleware to this route.
    // If a user who is not logged in tries to access this route they will be redirected to the signup page
    app.get("/members", isAuthenticated, function(req, res) {
        res.sendFile(path.join(__dirname, "../public/members.html"));
    });
};