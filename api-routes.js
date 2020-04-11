// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");
// Will add dotenv in later 
var stripe = require('stripe')('sk_test_Em0lVIiWzkkDqEro2ocRUt1400SCdpJAEz');

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
            .then(function() {
                res.redirect(307, "/api/login");
            })
            .catch(function(err) {
                res.status(401).json(err);
            });
    });

   

    // Route for logging user out
    app.get("/logout", function(req, res) {
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
                email: req.user.email,
                id: req.user.id
            });
        }
    });

   

    //Route for payment method 
    app.get('/setup_intents', async (req, res) => {

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
    
    app.post('/confirmed_subscription', async (req, res) => {
        //create customer
        //create subscription
        let customer;
        let subscription;
        let name;
       
    
        try{
          customer = await stripe.customers.create({
            email: req.body.email,
            name: req.body.name,
            payment_method: req.body.payment_method,
            name: req.body.name,
            invoice_settings: {
              default_payment_method: req.body.payment_method,
            },
          });
        } catch(e) {
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
        } catch(e) {
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