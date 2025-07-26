const axios = require("axios");
const { generateConfig } = require("../utils");
const nodemailer = require("nodemailer");
const CONSTANTS = require("../constants");
const { google } = require("googleapis");
const fs = require('fs')

require("dotenv").config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);


oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });


async function getUser(req, res) {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/profile`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}

async function getDrafts(req, res) {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/drafts`;
    const { token } = await oAuth2Client.getAccessToken();
    const config = generateConfig(url, token);
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    console.log(error);
    return error;
  }
}


async function readMail(req, res) {
  try {
  } catch (error) {
    res.send(error);
  }
}

async function sendMail(req, res) {
  const student = req.session.current_user;
  const userdata = JSON.parse(fs.readFileSync('users.json'));
  const purchaseitem = req.body.purchase;
  const instructor = req.body.instructor;
  const stud_email = userdata[student].email;
  const inst_email = userdata[instructor].email;
  const stud_fullname = userdata[student].fullname;
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        ...CONSTANTS.auth,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "mini.minniesoo@gmail.com",
      to: inst_email,
      subject: `${stud_fullname} -- Purchase: ${purchaseitem}`,
      text: `Student ${stud_fullname} has purchased item of product id ${purchaseitem}. `,
    };

    const result = await transport.sendMail(mailOptions);
    res.json({success:true, msg: "Email successfully sent."});
  } catch (error) {
    console.log(error);
    res.send(error);
  }
}


// async function sendMail(req, res) {
//   const keys = JSON.parse(fs.readFileSync('credentials.json'));
//   console.log("KEYS: ", keys)
//   const token = JSON.parse(fs.readFileSync('token.json'));
//   console.log("TOKEN: ", token)
//   try {
//     const oAuth2Client = new google.auth.OAuth2(
//       keys.web.client_id,
//       keys.web.client_secret,
//       keys.web.redirect_uris
//     );
//     oAuth2Client.setCredentials({
//     refresh_token: token.refresh_token,
//     });
//     console.log("1")
//     const accessToken = await oAuth2Client.getAccessToken();
//     console.log(accessToken)

//     oAuth2Client.setCredentials({
//       refresh_token: token.refresh_token,
//       access_token: accessToken.token
//     });
//     console.log("CLIENT: ", oAuth2Client)
 
//     const transport = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         type: 'OAuth2',
//         user: 'mini.minniesoo@gmail.com',  // Your email here
//         clientId: keys.web.client_id,
//         clientSecret: keys.web.client_secret,
//         refreshToken: token.refresh_token,
//         accessToken: accessToken.token, // Use accessToken.token
//     }
//     });
//     console.log("2")
//     const mailOptions = {
//         from: "mini.minniesoo@gmail.com",
//         to: "mini.minniesoo@gmail.com",
//         subject: "Gmail API NodeJS",
//         text: "The Gmail API with NodeJS works",
//     };
//     console.log("3")
//     const result = await transport.sendMail(mailOptions);
//     res.send(result);
//   } catch (error) {
//     console.log(error);
//     res.send(error);
//   }
// }

module.exports = {
  getUser,
  sendMail,
  getDrafts,
  readMail,
};