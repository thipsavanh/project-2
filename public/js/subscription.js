var stripe = Stripe('pk_test_Ht6nASSlShEBcMqEecTitz2K00gFtCKh7m');
var elements = stripe.elements();

var cardElement = elements.create('card');
cardElement.mount('#card');

let setupIntentSecret;

fetch('/setup_intents')
    .then((response) => response.json())
    .then((data) => {
        setupIntentSecret = data.client_secret;
        console.log('Creating setup intent...');
        console.log('Setup intent created! ' + setupIntentSecret);
    })
    .catch((error) => {
        console.log('Error:', error);
    });

var payBtn = document.getElementById('pay-btn');
var emailInput = document.getElementById('email-input');
var subSelection = document.getElementById('sub-input');
var nameInput = document.getElementById('name-input');
payBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    console.log('Confirming card setup...');
    const confirmation = await stripe.confirmCardSetup(
        setupIntentSecret,
        {
            payment_method: {
                card: cardElement,
                billing_details: {
                    email: emailInput.value,
                },
            }
           
        }
        
    );
    if (confirmation.error) {
        console.log('Confirmation of card details failed');
        return;
    }
 

    fetch('/confirmed_subscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: emailInput.value,
            subscription: subSelection.value,
            name: nameInput.value,
            payment_method: confirmation.setupIntent.payment_method,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log('Success: ', data);
        console.log('Customer and subscription created');
    })
    .catch((error) => {
        console.log('Error:', error);
    });

    alert("Payment Success! " + "Redirecting to login page ");
    redirect();
});

function redirect(){
    window.location.replace("/login");
}
