// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");
var axios = require("axios")
    // Will add dotenv in later 
var stripe = require('stripe')('sk_test_Em0lVIiWzkkDqEro2ocRUt1400SCdpJAEz');
var env = require("dotenv").config();

var Pusher = require('pusher');

var pusher = new Pusher({
    appId: '979597',
    key: process.env.API_PUSHER_KEY,
    secret: 'c1dea7cde1aa39a86b01',
    cluster: 'us2',
    encrypted: true
});


module.exports = function(app) {
    // Using the passport.authenticate middleware with our local strategy.
    // If the user has valid login credentials, send them to the members page.
    // Otherwise the user will be sent an error
    app.post("/api/login", passport.authenticate("local"), function(req, res) {

        // Sending back a password, even a hashed password, isn't a good idea
        res.json({
            email: req.user.email,
            id: req.user.id
        });
    });

    // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
    // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
    // otherwise send back an error
    app.post("/api/signup", function(req, res) {
        console.log(req.body)
            // res.redirect(307, "/subscription");
        res.send(200)
        db.User.create({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                full_name: req.body.full_name,
                address: req.body.address,
                address2: req.body.address2,
                city: req.body.city,
                state: req.body.state,
                zip: req.body.zip
            })
            .then(function(data) {
                res.status(200).send;
                // res.redirect(307, "/subscription");
                // if it works then send a response (data) from seq. db and send this in the res.send
                // if (!err) {
                //     res.status(200).send;
                //     // The user is not logged in, send back an empty object
                // } else {
                //     // Otherwise send back the user's email and id
                //     // Sending back a password, even a hashed password, isn't a good idea

                //         return res.status(200).json({ message: "user created" });
                //       }).catch(Sequelize.ValidationError, function (msg) {
                //         return res.status(422).send(err.errors);
            })
            .catch(function(err) {

                console.log(err)

                res.status(401).json(err);
            });
    });

    app.get("/signup", function(req, res) {
        // req.logout();
        res.redirect("/");
    });

    //BLOG POST API's
    app.get("/api/users", function(req, res) {
        // Here we add an "include" property to our options in our findAll query
        // We set the value to an array of the models we want to include in a left outer join
        // In this case, just db.Post
        db.User.findAll({
            include: [db.Post]
        }).then(function(dbUser) {
            res.json(dbUser);
        });
    });

    app.post("/api/users", function(req, res) {
        db.User.create(req.body).then(function(dbUsers) {
            res.json(dbUsers);
        });
    });

    app.get("/api/posts", function(req, res) {
        var query = {};
        if (req.query.User_id) {
            query.UserId = req.query.User_id;
        }
        db.Post.findAll({
            where: query,
            include: [db.User]
        }).then(function(dbPost) {
            res.json(dbPost);
        });
    });

    app.post("/api/posts", function(req, res) {
        console.log(req.body);
        db.Post.create(req.body).then(function(dbPost) {
            res.json(dbPost);
        });
    });

    app.get("/api/users/:id", function(req, res) {
        db.Users.findOne({
            where: {
                id: req.params.id
            },
            include: [db.Post]
        }).then(function(dbUsers) {
            res.json(dbUsers);
        });
    });

    app.delete("/api/posts/:id", function(req, res) {
        db.Post.destroy({
            where: {
                id: req.params.id
            }
        }).then(function(dbPost) {
            res.json(dbPost);
        });
    });


    app.post('/blogpostcomment', function(req, res) {
        console.log(req.body);
        var newComment = {
            user: req.body.user,
            comment: req.body.comment
        }
        pusher.trigger('flash-comments', 'new_comment', newComment);
        res.json({ created: true });
        // db.Comment.create(req.body).then(function(dbComment) {
        //   res.json(dbComment);
        // });
    });

    app.put("/api/posts", function(req, res) {
        db.Post.update(
            req.body, {
                where: {
                    id: req.body.id
                }
            }).then(function(dbPost) {
            res.json(dbPost);
        });
    });

    app.post("/api/comments", function(req, res) {
        comment = {
            user: req.body.user,
            body: req.body.comment
        }
        console.log("line 162" + comment)
        db.Comment.create(comment)
            .then(function() {
                res.status(200).send;
            })
            .catch(function(err) {
                console.log(err)
                res.status(401).json(err);
            });
    });


    //BOOKSHELF API's
    app.post("/bookshelf", function(req, res) {
        // console.log(req.body)
        // console.log(res)
        book = {
            title: req.body.title,
            author: req.body.author,
            image: req.body.image,
            ISBN: req.body.isbn
        }
        console.log(book)
        db.Library.create(book)
            .then(function() {
                res.status(200).send;
                // res.redirect("/bookshelf")
            })
            .catch(function(err) {
                console.log(err)
                res.status(401).json(err);
            });
    });


    app.get("/bookshelf", function(req, res) {
        // req.logout();
        res.redirect("/");
    });

    app.get("/getbooks/:title", function(req, res) {
        // req.params.title
        console.log(req.params.title)
        var yourAPIKey = "AIzaSyDkN88vIBWXAbfxV4WBnTEVJ8aZeh93mks";
        // Send an AJAX GET-request with jQuery TO GOOGLE BOOKS API
        var queryURL = `https://www.googleapis.com/books/v1/volumes?q=search+${req.params.title}+maxResults=5&${yourAPIKey}`
            //  https://www.googleapis.com/books/v1/volumes?q=${isbn}&key=${yourAPIKey} 

        axios.get(queryURL).then(function(response) {
                console.log(response.data.items[0].volumeInfo.title)

                res.json(response.data)
                    // console.log(response.items[0].volumeInfo.title)
                    // console.log(response.items[0].volumeInfo.authors)
                    // console.log(response.items[0].volumeInfo.description)
                    // console.log(response.items[0].volumeInfo.imageLinks.smallThumbnail)
            })
            // .then(function() {
            //     res.redirect(307, "/bookshelf");
            // })
            // .catch(function(err) {
            //     res.status(401).json(err);
            // });
    });

    app.get("/api/library", function(req, res) {
        db.Library.findAll({

        }).then(function(dbLibrary) {
            res.json(dbLibrary);
        }).catch(function(err) {
            res.status(401).json(err);
        });
    });
    app.get("/library", function(req, res) {
        // req.logout();
        res.redirect("/");
    });
    app.get("/wishlist", function(req, res) {
        // req.logout();
        res.redirect("/");
    });

    app.post("/wishlist", function(req, res) {
        console.log(req.body)
        wish = {
            title: req.body.title,
            author: req.body.author,
            image: req.body.image
        }
        console.log(wish)
        db.Wishlist.create(wish)
            .then(function() {
                res.status(200).send;
            })
            .catch(function(err) {
                console.log(err)
                res.status(401).json(err);
            });
    });

    app.post("/subscription", function(req, res) {
        console.log("test")
    });

    // Route for logging user out
    app.get("/logout", function(req, res) {
        req.logout();
        res.redirect("/");
    });

    app.get("/blogpost", function(req, res) {
        req.logout();
        res.redirect("/");
    });


    // Route for getting some data about our user to be used client side
    app.get("/api/user_data", function(req, res) {
        if (!req.user) {
            // The user is not logged in, send back an empty object
            res.json({});
        } else {
            // Otherwise send back the user's email and id
            // Sending back a password, even a hashed password, isn't a good idea
            res.json({
                full_name: req.user.full_name,
                email: req.user.email,
                id: req.user.id
            });
        }
    });

    //Route for payment method 
    app.get('/setup_intents', async(req, res) => {

        const setupIntent = await stripe.setupIntents.create({
            payment_method_types: ['card'],
            usage: 'off_session',
        });
        res.json(setupIntent);
    });

    const PLANS = [
        null,
        'Gold-plan',
        'Silver-plan',
        'Bronze-plan',
    ]

    app.post('/confirmed_subscription', async(req, res) => {
        //create customer
        //create subscription
        let customer;
        let subscription;
        let name;


        try {
            customer = await stripe.customers.create({
                email: req.body.email,
                name: req.body.name,
                payment_method: req.body.payment_method,
                name: req.body.name,
                invoice_settings: {
                    default_payment_method: req.body.payment_method,
                },
            });
        } catch (e) {
            console.log(e);
            return res
                .status(422)
                .json({
                    message: 'Failed to create customer!',
                    details: e
                });
        }

        try {
            subscription = await stripe.subscriptions.create({
                customer: customer.id,
                //cancel_at: monthFromNOw(req.body.installments),
                items: [{
                    plan: PLANS[req.body.subscription],
                    quantity: 1,
                }]
            });
        } catch (e) {
            console.log(e);
            return res
                .status(422)
                .json({
                    message: "Failed to create subscription",
                    details: e
                });
        }

    })
};