require('dotenv').config();

const express = require('express');
const app = express();
const os = require('os');
const fs = require('fs');
const session = require('express-session');
const mySession = session({
    secret: process.env.SESSION_SECRET || "development-only-change-me",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 15000000 }
})
// const author = require('./test_oldfiles/authorization')
// const path = require("path");
// require("dotenv").config();
// // const fs = require('fs').promises;
// // const path = require('path');
// const process = require('process');
// const {authenticate} = require('@google-cloud/local-auth');
// const {google} = require('googleapis');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(mySession);
app.use(express.json());
app.use(express.static('public'));
app.set("view engine", "ejs")
app.use((req, res, next) => {
    res.locals.stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || '';
    next();
});

app.get('/runtime-config.js', (req, res) => {
    res.type('application/javascript').send(`window.SOOAR_CONFIG = ${JSON.stringify({
        googleClientId: process.env.GOOGLE_CLIENT_ID || '',
        googleApiKey: process.env.GOOGLE_API_KEY || ''
    })};`);
});

const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const instructorRoutes = require('./routes/instructor');
const displayRoutes = require('./routes/commonDisplay');
const purchaseRoutes = require('./routes/purchase');
const deepseekRoutes = require('./routes/deepseek');
const mailRoutes = require('./routes/mail')
const checkoutRoutes = require('./routes/checkout');


app.use('/auth', authRoutes);
app.use('/students', studentRoutes);
app.use('/instructors', instructorRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/deepseek', deepseekRoutes);
app.use('/display', displayRoutes)
app.use('/mail',mailRoutes)
app.use('/checkout', checkoutRoutes)

app.get('/testcheckout',(req,res)=>{
    res.render('checkout')
})

app.get('/', (req, res)=>{
    res.redirect("/display/home");
})


// Function to get the server's IP address
function getServerIp() {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
        for (const interface of networkInterfaces[interfaceName]) {
            // Return the first non-internal IPv4 address
            if (interface.family === 'IPv4' && !interface.internal) {
                return interface.address;
            }
        }
    }
    return 'IP not found';
}

// authorize().then(listLabels).catch(console.error);
// async function auth(){
//     const auth = await author.authorize();
//     app.locals.authClient = auth;
// }

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    const serverIp = getServerIp();
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('IP address:', serverIp);
});




