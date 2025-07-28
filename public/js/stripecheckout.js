// Fetch Checkout Session and retrieve the client secret
async function initCheckout(stripe,id=null) {
    
    const fetchClientSecret = async () => {
        const productid = $('#productname').val()
        const data = {
            "productid": productid,
            "purchaseid": id
        }
        const response = await fetch("/checkout/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const { clientSecret } = await response.json();
        return clientSecret;
    };

    // Initialize Checkout
    const checkout = await stripe.initEmbeddedCheckout({
        fetchClientSecret
    });
    
    // Mount Checkout
    await checkout.mount('#checkout');

}
