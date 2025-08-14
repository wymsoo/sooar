const express = require('express')
const router = express.Router()
const fs = require('fs');
const path = require('path')
const stripe = require('stripe')('sk_test_51RlO80Pw6VRYu2WWyHSeWbIJN5gbRpQosjeyrWnc4HUJIGeCFTdl60a1CZ75eVkK6ICZqraCstWf93jicybMNUZQ00ZB41PIiT');

router.post('/create-checkout-session', async (req, res) => {
  const prod_id = req.body.productid;
  console.log(prod_id)
  const purchaseid = req.body.purchaseid;
  const productdata = JSON.parse(fs.readFileSync('catalog.json'));
  const prod = productdata[prod_id];
  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price_data: {
        currency: prod.currency,
        product_data: {
          name: prod.name
        },
        unit_amount: prod.price,
      },
      quantity: 1,
    }],
    mode: 'payment',
    ui_mode: 'embedded',
    return_url: `https://sooar.net/checkout/checkoutReturn?session_id={CHECKOUT_SESSION_ID}&amount=${String(prod.price)}&id=${prod.id}&type=${prod.type}&purchaseid=${purchaseid}`
    //redirect_on_completion: 'never'

  });

  res.json({clientSecret: session.client_secret});
});

router.get('/session_status', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  res.json({
    status: session.status,
    payment_status: session.payment_status,
    customer_email: session.customer_details.email
  });
});

router.get('/checkoutReturn', (req,res)=>{
  const user = req.session.current_user;
  res.render('checkoutReturn',{user})
})

module.exports = router;



