require("dotenv").config();

const auth = {
  type: "OAuth2",
  user: "mini.minniesoo@gmail.com",
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
};

const mailoptions = {
  from: "mini.minniesoo@gmail.com",
  to: "mini.minniesoo@gmail.com",
  subject: "Gmail API NodeJS",
};

module.exports = {
  auth,
  mailoptions,
};