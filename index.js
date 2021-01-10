/*  EXPRESS */
const express = require("express");
const app = express();

app.set("view engine", "ejs");
var access_token = "";

app.get("/", function (req, res) {
  res.render("pages/index", { client_id: clientID });
});

const port = process.env.PORT || 2400;
app.listen(port, () => console.log("App listening on port " + port));

// Import the axios library, to make HTTP requests
const axios = require("axios");
// This is the client ID and client secret that you obtained
// while registering on github app
const clientID = "f6b9b34b0a5e777b5e01";
const clientSecret = "c5102c6de56fe247bd215cd5642cfd55943443fa";
// "9e15217cce244512f12e";
// const clientSecret = "4b22b19305b352254c0c9d6170035264b9a73f63";

// Declare the callback route
app.get("/github/callback", (req, res) => {
  // The req.query object has the query params that were sent to this route.
  const requestToken = req.query.code;

  axios({
    method: "post",
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSON
    headers: {
      accept: "application/json",
    },
  }).then((response) => {
    access_token = response.data.access_token;
    res.redirect("/success");
  });
});

app.get("/success", function (req, res) {
  axios({
    method: "get",
    url: `https://api.github.com/user`,
    headers: {
      Authorization: "token " + access_token,
    },
  }).then((response) => {
    console.log(response.data);
    res.render("pages/success", { userData: response.data });
  });
});
