const express = require('express')
const router = express.Router()
const fs = require('fs');
const path = require('path')
const stripe = require('stripe')('sk_test_51RlO80Pw6VRYu2WWyHSeWbIJN5gbRpQosjeyrWnc4HUJIGeCFTdl60a1CZ75eVkK6ICZqraCstWf93jicybMNUZQ00ZB41PIiT');

router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'T-shirt',
        },
        unit_amount: 2000,
      },
      quantity: 1,
    }],
    mode: 'payment',
    ui_mode: 'embedded',
    return_url: 'http://localhost:5100/html/checkoutReturn.html'
  });

  res.send({clientSecret: session.client_secret});
});

router.get('/session_status', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    payment_status: session.payment_status,
    customer_email: session.customer_details.email
  });
});

module.exports = router;



