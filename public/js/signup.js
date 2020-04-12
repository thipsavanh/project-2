$(document).ready(function() {
    // Getting references to our form and input
    var signUpForm = $("form.signup");
    var usernameInput = $("input#username-input");
    var emailInput = $("input#email-input");
    var passwordInput = $("input#password-input");
    var fullnameInput = $("input#fullname-input");
    var addressInput = $("input#address-input");
    var address2Input = $("input#address2-input");
    var cityInput = $("input#city-input");
    var stateInput = $("input#state-input");
    var zipInput = $("input#zip-input");


    // When the signup button is clicked, we validate the email and password are not blank
    signUpForm.on("submit", function(event) {
        event.preventDefault();
        var userData = {
            username: usernameInput.val().trim(),
            email: emailInput.val().trim(),
            password: passwordInput.val().trim(),
            full_name: fullnameInput.val().trim(),
            address: addressInput.val().trim(),
            address2: address2Input.val().trim(),
            city: cityInput.val().trim(),
            state: stateInput.val().trim(),
            zip: zipInput.val().trim()
        };

        if (!userData.username || !userData.email || !userData.password || !userData.full_name || !userData.address || !userData.city || !userData.state || !userData.zip) {
            return;
        }
        // If we have an email and password, run the signUpUser function
        signUpUser(userData.username, userData.email, userData.password, userData.full_name, userData.address, userData.address2, userData.city, userData.state, userData.zip);
        // usernameInput.val("");
        // emailInput.val("");
        // passwordInput.val("");
        // fullnameInput.val("");
        // addressInput.val("");
        // address2Input.val("");
        // cityInput.val("");
        // stateInput.val("");
        // zipInput.val("");
    });

    // Does a post to the signup route. If successful, we are redirected to the members page
    // Otherwise we log any errors

    function signUpUser(username, email, password, full_name, address, address2, city, state, zip) {
        $.post("/api/signup", {
                username: username,
                email: email,
                password: password,
                full_name: full_name,
                address: address,
                address2: address2,
                city: city,
                state: state,
                zip: zip
            })
            .then(function(data) {
                // console.log(err)
                //based on the data that I get back, if success run this and if not send an error message
                //data is the checker (client) add a condition for this
                window.location.replace("/subscription");
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

    // function redirect(){
    //     window.location.replace("/subscription");
    // };
});